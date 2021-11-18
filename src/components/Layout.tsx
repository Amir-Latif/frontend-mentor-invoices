import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { Outlet } from "react-router";
import { AmirLatifIcon, IconCrescent, IconSun, Logo } from "..";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme } from "../store/invoiceSlice";
import { RootState } from "../store/store";
import './layout.css'

export default function Layout() {
    const theme: string = useAppSelector((store: RootState) => store.themeDay)
    const dispatch = useAppDispatch()
    const [desktopMediaQuery, setdesktopMediaQuery] = useState(window.matchMedia('(min-width: 992px)').matches)

    useEffect(() => {
        window.addEventListener('resize', () =>
            setdesktopMediaQuery(window.matchMedia('(min-width: 992px)').matches ? true : false)
        )
    })

    return (
        <div className={theme === 'night' ? "night-mode" : ""}>

            <div id="layout" className={desktopMediaQuery ? "d-flex flex-row" : "d-flex flex-column"}>
                <Stack id="side-pane" direction={desktopMediaQuery ? "vertical" : "horizontal"} gap={3}>
                    <div id="logo">
                        <a href="/"><img src={Logo} alt="logo" width="28rem" height="27rem" /></a>
                    </div>

                    <button id="theme-icon" onClick={() => dispatch(toggleTheme())}>
                        <img src={theme === "day" ? IconCrescent : IconSun} alt="theme icon" width="20rem" height="20rem" />
                    </button>

                    <div id="amir-pic">
                        <a href="https://amir-latif.github.io/portfolio/" target="_blank" rel="noopener"><img src={AmirLatifIcon} alt="Amir Latif icon" width="60rem" height="60rem" /></a>
                    </div>

                </Stack>

                <Outlet />
            </div >
        </div>

    )
}