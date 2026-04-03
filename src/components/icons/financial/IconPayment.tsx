import { MdPayment } from "react-icons/md";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconPayment = ({obj, getObj, action}: TProp) => {

    return (
        <div title="Baixar título" onClick={() => getObj(obj, action)} className="cursor-pointer text-green-400 hover:text-green-500">
            <MdPayment size={18} />
        </div>
    )
}