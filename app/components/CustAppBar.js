import React from "react";
import { Appbar } from "react-native-paper";

const CustAppBar = ({ title, backAction, onMenuPress }) => {
    return (
        <Appbar.Header mode='small'>
            {backAction && <Appbar.BackAction onPress={backAction} />}
            <Appbar.Content title={title} />
            {onMenuPress && <Appbar.Action icon="menu" onPress={onMenuPress} />}
        </Appbar.Header>
    );
};

export default CustAppBar;