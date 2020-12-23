# Config.pri file version 2.0. Auto-generated by IDE. Any changes made by user will be lost!
BASEDIR = $$quote($$_PRO_FILE_PWD_)

device {
    CONFIG(debug, debug|release) {
        !profile {
            CONFIG += \
                config_pri_source_group1
        }
    }

    CONFIG(release, debug|release) {
        !profile {
            CONFIG += \
                config_pri_source_group2
        }
    }
}

simulator {
    CONFIG(debug, debug|release) {
        !profile {
            CONFIG += \
                config_pri_source_group2
        }
    }
}

config_pri_source_group1 {
    SOURCES += \
        $$quote($$BASEDIR/src/ApplicationThread.cpp) \
        $$quote($$BASEDIR/src/CustomModules/CustomModules.cpp) \
        $$quote($$BASEDIR/src/CustomModules/Module1.cpp) \
        $$quote($$BASEDIR/src/QJnextMainLoop.cpp) \
        $$quote($$BASEDIR/src/QtBridge.cpp) \
        $$quote($$BASEDIR/src/SignalHandler.cpp) \
        $$quote($$BASEDIR/src/module.cpp)

    HEADERS += \
        $$quote($$BASEDIR/src/ApplicationThread.hpp) \
        $$quote($$BASEDIR/src/CustomModules/Module1.hpp) \
        $$quote($$BASEDIR/src/CustomModules.hpp) \
        $$quote($$BASEDIR/src/QJnextMainLoop.hpp) \
        $$quote($$BASEDIR/src/QtBridge.hpp) \
        $$quote($$BASEDIR/src/QtDeclarativePrivate/qdeclarativedirparser_p.h) \
        $$quote($$BASEDIR/src/QtDeclarativePrivate/qdeclarativeglobal_p.hpp) \
        $$quote($$BASEDIR/src/QtDeclarativePrivate/qdeclarativemetatype_p.hpp) \
        $$quote($$BASEDIR/src/SignalHandler.hpp)
}

config_pri_source_group2 {
    SOURCES += \
        $$quote($$BASEDIR/src/ApplicationThread.cpp) \
        $$quote($$BASEDIR/src/CustomModules/CustomModules.cpp) \
        $$quote($$BASEDIR/src/CustomModules/Module1.cpp) \
        $$quote($$BASEDIR/src/QJnextMainLoop.cpp) \
        $$quote($$BASEDIR/src/QtBridge.cpp) \
        $$quote($$BASEDIR/src/SignalHandler.cpp) \
        $$quote($$BASEDIR/src/module.cpp)

    HEADERS += \
        $$quote($$BASEDIR/src/ApplicationThread.hpp) \
        $$quote($$BASEDIR/src/CustomModules/Module1.hpp) \
        $$quote($$BASEDIR/src/CustomModules.hpp) \
        $$quote($$BASEDIR/src/QJnextMainLoop.hpp) \
        $$quote($$BASEDIR/src/QtBridge.hpp) \
        $$quote($$BASEDIR/src/QtDeclarativePrivate/qdeclarativedirparser_p.h) \
        $$quote($$BASEDIR/src/QtDeclarativePrivate/qdeclarativeglobal_p.hpp) \
        $$quote($$BASEDIR/src/QtDeclarativePrivate/qdeclarativemetatype_p.hpp) \
        $$quote($$BASEDIR/src/SignalHandler.hpp)
}

INCLUDEPATH += $$quote($$BASEDIR/src/QtDeclarativePrivate) \
    $$quote($$BASEDIR/src/CustomModules) \
    $$quote($$BASEDIR/src)

lupdate_inclusion {
    SOURCES += \
        $$quote($$BASEDIR/../src/*.c) \
        $$quote($$BASEDIR/../src/*.c++) \
        $$quote($$BASEDIR/../src/*.cc) \
        $$quote($$BASEDIR/../src/*.cpp) \
        $$quote($$BASEDIR/../src/*.cxx) \
        $$quote($$BASEDIR/../src/CustomModules/*.c) \
        $$quote($$BASEDIR/../src/CustomModules/*.c++) \
        $$quote($$BASEDIR/../src/CustomModules/*.cc) \
        $$quote($$BASEDIR/../src/CustomModules/*.cpp) \
        $$quote($$BASEDIR/../src/CustomModules/*.cxx) \
        $$quote($$BASEDIR/../src/QtDeclarativePrivate/*.c) \
        $$quote($$BASEDIR/../src/QtDeclarativePrivate/*.c++) \
        $$quote($$BASEDIR/../src/QtDeclarativePrivate/*.cc) \
        $$quote($$BASEDIR/../src/QtDeclarativePrivate/*.cpp) \
        $$quote($$BASEDIR/../src/QtDeclarativePrivate/*.cxx)

    HEADERS += \
        $$quote($$BASEDIR/../src/*.h) \
        $$quote($$BASEDIR/../src/*.h++) \
        $$quote($$BASEDIR/../src/*.hh) \
        $$quote($$BASEDIR/../src/*.hpp) \
        $$quote($$BASEDIR/../src/*.hxx)
}

TRANSLATIONS = $$quote($${TARGET}.ts)