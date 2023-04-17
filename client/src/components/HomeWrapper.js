import { useContext, useEffect} from 'react';
import HomeScreen from './screens/HomeScreen';
import CommunityGuestScreen from './screens/CommunityGuestScreen';
import WelcomeScreen  from './screens/WelcomeScreen';
import AuthContext from '../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    console.log("HomeWrapper auth.guest: " + auth.guest);

    useEffect(() => {
      auth.getLoggedIn();
    }, []);
    if (auth.loggedIn)
        return <HomeScreen />
    else if (auth.guest)
        return <CommunityGuestScreen />
    else
        return <WelcomeScreen />
}