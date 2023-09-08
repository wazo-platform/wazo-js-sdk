# Copyright 2014-2023 The Wazo Authors  (see the AUTHORS file)
# SPDX-License-Identifier: GPL-3.0-or-later
from __future__ import annotations

import time
import sys
import os

from pwd import getpwnam

import subprocess
import getpass
from typing import TypeVar, Callable, Any

import psycopg2

from wazo_uuid.uuid_ import get_wazo_uuid
from xivo import db_helper
from xivo_db import path
from xivo_db.exception import DBError

RT = TypeVar('RT')


def run_as(user_name: str) -> Callable[[Callable[..., RT]], Callable[..., RT]]:
    def wrapper(f: Callable[..., RT]) -> Callable[..., RT]:
        def decorator(*args: Any, **kwargs: Any) -> RT:
            starting_uid = os.geteuid()
            user = getpwnam(user_name)
            os.seteuid(user.pw_uid)
            res = f(*args, **kwargs)
            os.seteuid(starting_uid)
            return res

        return decorator

    return wrapper


@run_as('postgres')
def init_db(db_name: str, db_user: str, db_user_password: str, pg_db_uri: str) -> None:
    for _ in range(40):
        try:
            conn = psycopg2.connect(pg_db_uri)
            break
        except psycopg2.OperationalError as e:
            print(e, file=sys.stderr)
            time.sleep(0.25)
    else:
        print('Failed to connect to postgres', file=sys.stderr)
        return

    conn.autocommit = True
    with conn:
        with conn.cursor() as cursor:
            if not db_helper.db_user_exists(cursor, db_user):
                db_helper.create_db_user(cursor, db_user, db_user_password)
            if not db_helper.db_exists(cursor, db_name):
                db_helper.create_db(cursor, db_name, db_user)


@run_as('postgres')
def enable_extension(extension: str, app_db_uri: str) -> None:
    with psycopg2.connect(app_db_uri) as conn:
        with conn.cursor() as cursor:
            cursor.execute(f'CREATE EXTENSION IF NOT EXISTS "{extension}"')


def drop_db(pg_db_uri: str, app_db_name: str) -> None:
    _call_as_postgres(
        path.PG_DROP_DB.format(pg_db_uri=pg_db_uri, app_db_name=app_db_name)
    )


def populate_db(app_db_uri: str) -> None:
    _call_as_postgres(
        path.PG_POPULATE_DB.format(wazo_uuid=get_wazo_uuid(), app_db_uri=app_db_uri)
    )


def _call_as_postgres(pathname: str) -> None:
    user = 'postgres'
    if getpass.getuser() == user:
        args = [pathname]
    else:
        args = ['su', '-c', pathname, user]

    if subprocess.call(args, cwd='/tmp'):
        raise DBError()
