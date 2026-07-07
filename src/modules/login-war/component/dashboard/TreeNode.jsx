// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// const TreeNode = ({ node, onTabChange, delay = 0,level = 0, }) => {
//     const [expanded, setExpanded] = useState(false);
//     const hasChildren =
//         (node?.subMenuTypes && node.subMenuTypes.length > 0) ||
//         (node?.items && node.items.length > 0);
//     const renderLink = (item) => {
//         const isHIS =
//             item?.link?.startsWith("/HIS_dashboard") ||
//             item?.link?.includes("/HIS_dashboard/");
//         if (isHIS) {
//             return (
//                 <a
//                     href={item?.link}
//                     className="tree-link"
//                     target="_self"
//                 >
//                     <div className="tree-link-content">
//                         <i className={`fa ${item?.icon}`}></i>
//                         <span>
//                             {item?.menuName}
//                         </span>
//                     </div>
//                 </a>
//             );
//         }
//         return (
//             <Link
//                 to={item?.link || "#"}
//                 className="tree-link"
//                 onClick={onTabChange}
//             >
//                 <div className="tree-link-content">
//                     <i className={`fa ${item?.icon}`}></i>
//                     <span>
//                         {item?.menuName}
//                     </span>
//                 </div>
//             </Link>
//         );
//     };
//     return (
//         <div
//             className="tree-node"
//             style={{
//                 animationDelay: `${delay * 60}ms`
//             }}
//         >
//             <div
//                 className={`tree-header ${expanded ? "active" : ""}`}
//                 onClick={() => setExpanded(!expanded)}
//             >
//                 <div className="tree-title">
//                     <i className="fa fa-folder tree-folder"></i>
//                     <span>
//                         {node?.title}
//                     </span>
//                 </div>
//                 {
//                     hasChildren &&
//                     <i
//                         className={`fa fa-chevron-right tree-arrow ${expanded ? "rotate" : ""}`}
//                     />
//                 }
//             </div>

//             {
//                 expanded &&
//                 <div className="tree-children">
//                     {
//                         node?.items?.map((item, index) => (
//                             <div
//                                 className="tree-item"
//                                 key={index}
//                             >
//                                 {renderLink(item)}
//                             </div>
//                         ))
//                     }
//                     {
//                         node?.subMenuTypes?.map((subMenu, index) => (
//                             <div
//                                 className="tree-submenu"
//                                 key={index}
//                             >
//                                 <TreeNode
//                                     node={subMenu}
//                                     onTabChange={onTabChange}
//                                     delay={index}
//                                 />
//                             </div>
//                         ))
//                     }
//                 </div>
//             }
//         </div>
//     );
// };
// export default TreeNode;
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TreeNode = ({
    node,
    onTabChange,
    level = 0,
    delay = 0,
    search = "",
}) => {

    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (search?.trim()?.length > 0 && node) {
            setExpanded(true);
        }
    }, [search])

    const hasChildren =
        node?.children &&
        node.children.length > 0;

    const location = useLocation();

    const renderLeaf = () => {
        const isExternal =
            node?.link?.startsWith("http");
        const isHIS =
            node?.link?.startsWith("/HIS_dashboard") ||
            node?.link?.includes("/HIS_dashboard/");

        if (isExternal || isHIS) {
            return (
                <a
                    href={node?.link}
                    target={isExternal ? "_self" : "_self"}
                    rel="noopener noreferrer"
                    className="tree-link"
                >
                    <div className="tree-link-content">
                        <i
                            className={
                                node?.icon ||
                                "fa fa-file"
                            }
                        />
                        <span>
                            {node?.title}
                        </span>
                    </div>
                </a>
            );
        }

        return (
            <Link
                to={node?.link || "#"}
                className={`tree-link ${node?.link && location.pathname === node.link ? "menu-active-link" : ""}`}
                onClick={onTabChange}
            >
                <div className="tree-link-content">
                    <i
                        className={
                            node?.icon ||
                            "fa fa-file"
                        }
                    />
                    <span>
                        {node?.title}
                    </span>
                </div>
            </Link>
        );
    };


    if (!hasChildren) {
        return (
            <div
                className="tree-item"
                style={{
                    paddingLeft:
                        `${level * 14}px`,
                    animationDelay:
                        `${delay * 50}ms`
                }}
            >
                {
                    renderLeaf()
                }
            </div>
        );
    }


    return (
        <div
            className="tree-node"
            style={{
                animationDelay:
                    `${delay * 50}ms`
            }}
        >
            <div
                className={
                    `tree-header ${expanded
                        ?
                        "active"
                        :
                        ""
                    }`
                }
                style={{
                    paddingLeft:
                        `${18 + level * 14}px`
                }}
                onClick={() =>
                    setExpanded(
                        !expanded
                    )
                }
            >
                <div
                    className="tree-title"
                >
                    <i
                        className={`
                        fa
                        ${expanded
                                ?
                                "fa-folder-open"
                                :
                                "fa-folder"
                            }
                        tree-folder
                        `}
                    />
                    <span>
                        {node?.title}
                    </span>
                </div>
                <i
                    className={`
                    fa
                    fa-chevron-right
                    tree-arrow
                    ${expanded
                            ?
                            "rotate"
                            :
                            ""
                        }
                    `}
                />
            </div>
            {
                expanded &&
                (
                    <div
                        className="tree-children"
                    >
                        {
                            node?.children?.map(
                                (
                                    child,
                                    index
                                ) =>
                                (
                                    <TreeNode
                                        key={
                                            child?.dataVal ||
                                            child?.title ||
                                            index
                                        }
                                        node={child}
                                        level={level + 1}
                                        delay={index}
                                        onTabChange={onTabChange}
                                        search={search}
                                    />
                                )
                            )
                        }
                    </div>
                )
            }
        </div>
    );
};
export default TreeNode;