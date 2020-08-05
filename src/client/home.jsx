import React from "react";
import {Link, withRouter} from "react-router-dom";


export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: null
        }
    }

    componentDidMount() {
        if(this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }
    }




    render() {

        const user = this.props.user;

        return(


            <div className="menuWrapper">
                <div>

                    <h2>Setup</h2>

                    <p>Welcome to the home page</p>



                </div>

                {user ? (
                    <div>
                        <p>Click the button to do stuff</p>
                        <p>Logged in!!!!!</p>

                        <div className="btnPart">
                            <Link to={"/countries"} className={"btn"}>Show complete list of Countries</Link>
                            <Link to={"/assignedCountries"} className={"btn"}>See your assigned countries</Link>
                        </div>

                    </div>
                ) : (
                    <div>
                        <p>
                            Log in/sign up to get premium access and ALSO get 1000 free credits
                        </p>
                        <div className="btnPart">
                            <Link to={"/countries"} className={"btn"}>Show complete list of Countries</Link>
                        </div>
                    </div>
                )}

            </div>
        )
    }

}

export default withRouter(Home);