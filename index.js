"use strict";

require('./GlobalImport')(global, require('./server/data/DbHelper'));
require('./server/Server').start();
