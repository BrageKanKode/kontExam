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
                            <Link to={"/auctions"} className={"btn"}>Show complete list of auctions</Link>
                            <Link to={"/assignedAuctions"} className={"btn"}>See your auctions</Link>
                        </div>

                    </div>
                ) : (
                    <div>
                        <p>
                            Log in/sign up to get premium access
                        </p>
                        <div className="btnPart">
                            <Link to={"/auctions"} className={"btn"}>Show complete list of auctions</Link>
                        </div>
                    </div>
                )}

            </div>
        )
    }

}

export default withRouter(Home);