import React from "react";
import AuctionItem from "./auction_item";

export class Create extends React.Component{

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        if(this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }
    }

    onOk = async (name, description, price, auctionId) => {
        const url = "/api/auctions";

        const payload = {name, description, price};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            return false;
        }

        return response.status === 201;
    };


    render() {
        const user = this.props.user;
        const loggedIn = user !== null && user !== undefined;

        return (
            <div>
                {loggedIn ? (
                    <div>
                        <h3>Create a new Menu Item</h3>
                        <AuctionItem
                            user={this.props.user}
                            name={""}
                            description={""}
                            price={""}
                            ok={"Create"}
                            okCallback={this.onOk}
                        />
                    </div>
                ) : (
                    <div className="menuWrapper">
                        <h2>Failed to execute </h2>
                        <p>You need to log in or register</p>
                    </div>
                )}

            </div>
        );
    }
}