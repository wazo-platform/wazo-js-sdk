# Copyright 2014-2023 The Wazo Authors  (see the AUTHORS file)
# SPDX-License-Identifier: GPL-3.0-or-later
from __future__ import annotations

import argparse
import logging
import xivo_dao.alchemy.all  # noqa - imports all the sqlalchemy model

from xivo_dao.helpers import db_manager
from xivo_dao.helpers.db_manager import Base
from xivo_db import alembic
from xivo_db import postgres

logger = logging.getLogger(__name__)


def _create_tables() -> None:
    logger.info('Creating all tables...')
    Base.metadata.create_all()


def _enable_extensions(app_db_uri: str) -> None:
    logger.info('Enabling extensions...')
    extensions = ['pgcrypto', 'uuid-ossp', 'unaccent']
    for extension in extensions:
        postgres.enable_extension(extension, app_db_uri)


def _populate_db(app_db_uri: str) -> None:
    logger.info('Populating database...')
    postgres.populate_db(app_db_uri)


def _drop_db(pg_db_uri: str, app_db_name: str) -> None:
    logger.info('Dropping database...')
    postgres.drop_db(pg_db_uri, app_db_name)


def _init_db(db_name: str, db_user: str, db_user_password: str, pg_db_uri: str) -> None:
    logger.info('Initializing database...')
    postgres.init_db(db_name, db_user, db_user_password, pg_db_uri)
    alembic.stamp_head()
    db_manager.init_db_from_config()


def main() -> None:
    parsed_args = _parse_args()

    _init_logging(parsed_args.verbose)

    if parsed_args.drop:
        _drop_db(parsed_args.pg_db_uri, parsed_args.db)

    if parsed_args.init:
        _init_db(
            parsed_args.db,
            parsed_args.owner,
            parsed_args.password,
            parsed_args.pg_db_uri,
        )
        _enable_extensions(parsed_args.app_db_uri)
        _create_tables()
        _populate_db(parsed_args.app_db_uri)


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '-v', '--verbose', action='store_true', help='increase verbosity'
    )
    parser.add_argument('--drop', action='store_true', help='drop database')
    parser.add_argument('--init', action='store_true', help='initialize database')
    parser.add_argument(
        '--pg_db_uri',
        action='store',
        default='postgresql:///postgres',
        help="The DSN to connect to the postgres DB as a superuser",
    )
    parser.add_argument(
        '--app_db_uri',
        action='store',
        default='postgresql:///asterisk',
        help="The DSN to connect to the app DB as a superuser",
    )
    parser.add_argument(
        '--db',
        action='store',
        default='asterisk',
        help="The database name that will be created",
    )
    parser.add_argument(
        '--owner',
        action='store',
        default='asterisk',
        help="The database user that will be created and that will own the database",
    )
    parser.add_argument(
        '--password',
        action='store',
        default='proformatique',
        help="The password that will be assigned to the created user",
    )
    return parser.parse_args()


def _init_logging(verbose: bool) -> None:
    logger = logging.getLogger()
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('%(message)s'))
    logger.addHandler(handler)
    if verbose:
        logger.setLevel(logging.INFO)
    else:
        logger.setLevel(logging.ERROR)
