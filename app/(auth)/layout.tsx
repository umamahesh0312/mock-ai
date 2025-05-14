import { ReactNode } from 'react'
import {reactNodeModulesRe} from "next/dist/shared/lib/is-internal";

const AuthLayout = ({children}:{children:ReactNode}) => {
    return (
        <div className="auth-layout">{children}</div>
    )
}
export default AuthLayout
