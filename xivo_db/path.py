# Copyright 2014-2018 The Wazo Authors  (see the AUTHORS file)
# SPDX-License-Identifier: GPL-3.0-or-later

import os.path

USR_LIB = '/usr/lib/xivo-manage-db'
USR_SHARE = '/usr/share/xivo-manage-db'

PG_DROP_DB = os.path.join(USR_LIB, 'pg-drop-db {pg_db_uri} {app_db_name}')
PG_POPULATE_DB = os.path.join(USR_LIB, 'pg-populate-db {wazo_uuid} {app_db_uri}')
