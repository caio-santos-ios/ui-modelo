import { getUserLogged } from "./auth.util";

const userLogged = getUserLogged();

export const permissionRead = (module: string, subModule: string) => {
    if (userLogged.admin || userLogged.master) return true;

    if (userLogged.modules) {
        const currentModule = userLogged.modules.findIndex((m: any) => m.code == module);
        if (currentModule >= 0) {
            const currentRoutine = userLogged.modules[currentModule].Routines.findIndex((r: any) => r.code == subModule);
            if (currentRoutine >= 0) {
                return userLogged.modules[currentModule].Routines[currentRoutine].permissions.create;
            }
        }
    }
    return false;
};

export const permissionCreate = (module: string, subModule: string) => {
    if (userLogged.admin || userLogged.master) return true;

    if (userLogged.modules) {
        const currentModule = userLogged.modules.findIndex((m: any) => m.code == module);
        if (currentModule >= 0) {
            const currentRoutine = userLogged.modules[currentModule].Routines.findIndex((r: any) => r.code == subModule);
            if (currentRoutine >= 0) {
                return userLogged.modules[currentModule].Routines[currentRoutine].permissions.create;
            }
        }
    }
    return false;
};

export const permissionUpdate = (module: string, subModule: string) => {
    if (userLogged.admin || userLogged.master) return true;

    if (userLogged.modules) {
        const currentModule = userLogged.modules.findIndex((m: any) => m.code == module);
        if (currentModule >= 0) {
            const currentRoutine = userLogged.modules[currentModule].Routines.findIndex((r: any) => r.code == subModule);
            if (currentRoutine >= 0) {
                return userLogged.modules[currentModule].Routines[currentRoutine].permissions.create;
            }
        }
    }
    return false;
};

export const permissionDelete = (module: string, subModule: string) => {
    if (userLogged.admin || userLogged.master) return true;

    if (userLogged.modules) {
        const currentModule = userLogged.modules.findIndex((m: any) => m.code == module);
        if (currentModule >= 0) {
            const currentRoutine = userLogged.modules[currentModule].Routines.findIndex((r: any) => r.code == subModule);
            if (currentRoutine >= 0) {
                return userLogged.modules[currentModule].Routines[currentRoutine].permissions.create;
            }
        }
    }
    return false;
};