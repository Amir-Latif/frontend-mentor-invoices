import React, { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme } from "../store/invoiceSlice";
import { RootState } from "../store/store";
import './layout.css'

export default function Layout({ children }: React.PropsWithChildren<{ children: ReactNode, }>) {
    const theme: string = useAppSelector((store: RootState) => store.themeDay)
    const dispatch = useAppDispatch()

    return (
        <React.Fragment>
            <section id="layout" className="am-flex">
                <div id="logo">
                    <img src="images/logo.svg" alt="logo" width="28rem" height="27rem" />
                </div>

                <div className="am-flex">
                    <button id="theme-icon" onClick={() => dispatch(toggleTheme())}>
                        <img src={theme === "day"? 'images/icon-crescent.svg' : 'images/icon-sun.svg'} alt="theme icon" width="20rem" height="20rem" />
                    </button>

                    <div id="amir-pic">
                        <img src="images/amir-latif.png" alt="Amir Latif icon" width="40rem" height="40rem" />
                    </div>
                </div>

            </section>
        </React.Fragment>
    )
}