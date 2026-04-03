import { MdCancel } from "react-icons/md";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconCancel = ({obj, getObj, action}: TProp) => {

    return (
        <div title="Cancelar" onClick={() => getObj(obj, action)} className="cursor-pointer text-red-400 hover:text-red-500">
            <MdCancel size={18} />
        </div>
    )
}