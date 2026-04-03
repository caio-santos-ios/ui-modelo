"use cliente";

import Image from "next/image"

type TProp = {
    width: number;
    height: number
}

export const Logo = ({width, height}: TProp) => {
    return (
        <div>
            <img className="dark:hidden" src="/assets/images/logo.png" />
            <img className="hidden dark:flex" src="/assets/images/logo-dark.png" />
        </div>
    )
}