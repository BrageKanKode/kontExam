// https://github.com/arcuri82/web_development_and_api_design/blob/master/les07/server_client_together/src/client/create.jsx
//This code is from the repository, but is refitted to fit the assignment


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

    onOk = async (name, description, price, currentBid, available, userId) => {
        const url = "/api/auctions";

        const payload = {name, description, price, currentBid, available, userId};

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
                            currentBid={""}
                            available={""}
                            userId={this.props.user.userId}
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