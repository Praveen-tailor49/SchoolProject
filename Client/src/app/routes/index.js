import ProctectRoutes from './ProctectRoutes';
import PublicRutes from './PublicRutes';
import withRoute from './withRoute';

const AppRoute = (props) => {
    const { auth } = props;
    return (auth ? <ProctectRoutes {...props} /> : <PublicRutes {...props} />);
}

export default withRoute(AppRoute);
