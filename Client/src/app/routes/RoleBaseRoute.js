const RoleBaseRoute = ({ role, children }) => {
    if(role == "user") return <></>
    return children
}

export default RoleBaseRoute