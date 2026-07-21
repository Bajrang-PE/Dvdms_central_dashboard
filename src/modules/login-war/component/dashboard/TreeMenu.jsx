import React from "react";
import TreeNode from "./TreeNode";

const TreeMenu = ({ menuData, onTabChange, search }) => {

    return (
        <div className="tree-menu">

            {
                menuData?.map((menu, index) => (

                    <TreeNode
                        key={index}
                        node={menu}
                        onTabChange={onTabChange}
                        delay={index}
                        level={0}
                        search={search}
                    />

                ))
            }

        </div>
    );

};

export default TreeMenu;