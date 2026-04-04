//你所拥有的权限 当前按钮所需要的权限  
function withPermissions(
    requiredPermissions: string[],
    userPermissions?: string[]
): (Component: React.FC) => React.FC {

    return function (Component: React.FC) {
        return function (props: any): React.ReactElement | null {

            // ✅ 防御：权限未加载
            if (!Array.isArray(userPermissions)) {
                return null; // 或者 loading
            }

            const hasPermission = requiredPermissions.every(item =>
                userPermissions.includes(item)
            );

            if (!hasPermission) {
                return null;
            }

            return <Component {...props} />;
        };
    };
}

export default withPermissions