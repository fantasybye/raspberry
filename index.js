"use strict";

require('./GlobalImport')(global, require('./server/dao/DbHelper'));
require('./server/Server').start();
