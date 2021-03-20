import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Card from '../components/card'

const Routes = () => {
    return (
        <Router>
            <Route exact path="/" component={Card} />
            <Route path="/tp-1" component={Card} />
        </Router>
    );
}
export default Routes;