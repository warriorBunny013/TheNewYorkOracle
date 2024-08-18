import React from 'react';

const Header = () => {
  return (
    <div className="navbar bg-base-100">
  <div className="flex-1">
    <div className="btn btn-ghost text-xl">daisyUI</div>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      <li><div>Link</div></li>
      <li>
        <details>
          <summary>Parent</summary>
          <ul className="bg-base-100 rounded-t-none p-2">
            <li><div>Link 1</div></li>
            <li><div>Link 2</div></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>
  );
};

export default Header;
