# Copyright 2014-2023 The Wazo Authors  (see the AUTHORS file)
# SPDX-License-Identifier: GPL-3.0-or-later
from __future__ import annotations

import re
import subprocess
from typing import NamedTuple, Any

from xivo_db import path
from xivo_db.exception import DBError


class _AlembicCurrentStatus(NamedTuple):
    revision: str
    is_head: bool


def check_db() -> None:
    print('Checking database...')
    p = _new_alembic_popen(['current'], stdout=subprocess.PIPE, text=True)
    output = p.communicate()[0]
    if p.returncode:
        raise Exception(f'alembic command returned {p.returncode}')

    status = _parse_alembic_current_output(output)
    if status.is_head:
        status_msg = 'OK'
    else:
        status_msg = f'NOK (current revision is {status.revision})'
    print(f'\t{status_msg}')


def _parse_alembic_current_output(output: str) -> _AlembicCurrentStatus:
    match = re.match(r'^(\w+)( \(head\))?$', output)
    if not match:
        raise Exception(f'not a valid alembic current output: {output!r}')

    return _AlembicCurrentStatus(match.group(1), True if match.group(2) else False)


def update_db() -> None:
    if _new_alembic_popen(['upgrade', 'head']).wait():
        raise DBError()


def stamp_head() -> None:
    if _new_alembic_popen(['stamp', 'head']).wait():
        raise DBError()


def _new_alembic_popen(args: list[str], **kwargs: Any) -> subprocess.Popen:
    args = ['alembic'] + args
    return subprocess.Popen(args, cwd=path.USR_SHARE, **kwargs)
