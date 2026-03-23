"use client";

import { useState } from "react";
import UserDataForm from "./UserDataForm";

type TProp = {
  id?: string;
};

export default function UserForm({id}: TProp) {
  const [tabs] = useState<{key: string; title: string;}[]>([
    {key: 'data', title: 'Dados Gerais'},
  ]);

  const [currentTab, setCurrentTab] = useState<any>({key: 'data', title: 'Dados Gerais'});


  return (
    <>
      <div className="flex items-center font-medium gap-2 rounded-lg transition px-2 py-2 text-sm border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 mb-3 text-gray-700 dark:text-gray-400">
        {tabs.map((x) => (
          <button 
            key={x.key}
            onClick={() => setCurrentTab(x)} 
            className={`${currentTab.key === x.key ? 'bg-brand-500 text-white' : ''} px-3 py-1 rounded-md transition-all`}>
            {x.title}
          </button>
        ))}
      </div>
      
      <div className="mb-2">
        {currentTab.key == "data" && <UserDataForm id={id} />}
      </div>     
    </>
  );
}