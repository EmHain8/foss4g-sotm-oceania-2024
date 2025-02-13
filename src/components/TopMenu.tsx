import React, { useState } from "react";

type TopMenuProps = {
  children: React.ReactNode;
  setMenuOpen: (menuOpen: boolean) => void;
};

type SubMenuItem = {
  href: string;
  text: string;
};

type RootMenuItem = {
  href: string;
  text: string;
  subMenuItems: SubMenuItem[];
  isShown: boolean;
};

type RootMenuItems = RootMenuItem[];

const TopMenu: React.FC<TopMenuProps> = ({ children, setMenuOpen }) => {
  const headingLinks: RootMenuItems = [];

  React.Children.map(children, (child, _index) => {
    const extractTextFromElement = (element: React.ReactNode) => {
      if (React.isValidElement(element)) {
        const link = {
          href: element.props.children[0].props.href,
          text: element.props.children[0].props.children[0],
          subMenuItems: [] as SubMenuItem[],
          isShown: false,
        };

        if (element.props.children.length > 1) {
          for (
            let i = 0;
            i < element.props.children[2].props.children.length;
            i++
          ) {
            const subMenuLink = {
              href: element.props.children[2].props.children[i].props
                .children[0].props.href,
              text: element.props.children[2].props.children[i].props
                .children[0].props.children[0],
            };
            link.subMenuItems.push(subMenuLink);
          }
        }

        headingLinks.push(link);
      }
      return null;
    };

    extractTextFromElement(child);

    return null;
  });

  const [menuItems, setMenuItems] = useState(headingLinks);

  const handleMouseEnter = (heading: string) => {
    setMenuItems((prevMenuItems) =>
      prevMenuItems.map((item) =>
        item.text === heading ? { ...item, isShown: true } : item
      )
    );
  };

  const handleMouseLeave = (heading: string) => {
    setMenuItems((prevMenuItems) =>
      prevMenuItems.map((item) =>
        item.text === heading ? { ...item, isShown: false } : item
      )
    );
  };

  const renderedMenuItems = menuItems.map((menuItem, index) => (
    <React.Fragment key={index}>
      {menuItem.subMenuItems.length === 0 && (
        <a
          href={menuItem.href}
          onClick={() => {
            setMenuOpen(false);
          }}
          className="font-bold block text-sky transition-colors duration-300 md:px-6 hover:text-indigo-300 text-center"
        >
          {menuItem.text}
        </a>
      )}
      {menuItem.subMenuItems.length > 0 && (
        <div
          onMouseEnter={() => handleMouseEnter(menuItem.text)}
          onMouseLeave={() => handleMouseLeave(menuItem.text)}
          className="relative"
        >
          <a
            href={menuItem.href}
            onClick={() => {
              setMenuOpen(false);
            }}
            className="font-bold block text-sky transition-colors duration-300 md:px-6 hover:text-indigo-300 text-center min-w-full"
          >
            {menuItem.text}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 inline ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M6 8l4 4 4-4H6z" />
            </svg>
          </a>
          <div className="hidden md:block">
            <div
              style={{
                display: menuItem.isShown ? "block" : "none",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              className="absolute bg-blue-950 rounded-md shadow-lg min-w-full w-fit text-center pt-4 pb-1 hidden md:inline-block"
            >
              {menuItem.subMenuItems.map((subMenuItem, subIndex) => (
                <a
                  key={subIndex}
                  href={subMenuItem.href}
                  className="block px-4 py-2 text-sky hover:bg-blue-900 whitespace-nowrap"
                >
                  {subMenuItem.text}
                </a>
              ))}
            </div>
          </div>
          <div className="block md:hidden">
            <div style={{ display: menuItem.isShown ? "block" : "none" }}>
              {menuItem.subMenuItems.map((subMenuItem, subIndex) => (
                <a
                  key={subIndex}
                  href={subMenuItem.href}
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sky hover:bg-blue-900 text-center"
                >
                  {subMenuItem.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  ));

  return <>{renderedMenuItems}</>;
};
export default TopMenu;
