import React from 'react';

export const TopBarActions = () => (
  <div className="topbar-actions">
    <div className="btn-group-notification btn-group" id="header_notification_bar">
      <button type="button" className="btn btn-sm md-skip dropdown-toggle" data-toggle="dropdown"
              data-hover="dropdown" data-close-others="true">
        <i className="fa fa-bell"></i>
        <span className="badge">7</span>
      </button>
      <ul className="dropdown-menu-v2">
        <li className="external">
          <h3>
            <span className="bold">12 pending</span> notifications</h3>
          <a href="#">view all</a>
        </li>
        <li>
          <ul className="dropdown-menu-list scroller" style={{height: 250, padding: 0}}
              data-handle-color="#637283">
            <li>
              <a href="javascript:;">
                                                        <span className="details">
                                                            <span
                                                              className="label label-sm label-icon label-success md-skip">
                                                                <i className="fa fa-plus"></i>
                                                            </span> New user registered. </span>
                <span className="time">just now</span>
              </a>
            </li>
            <li>
              <a href="javascript:;">
                                                        <span className="details">
                                                            <span
                                                              className="label label-sm label-icon label-danger md-skip">
                                                                <i className="fa fa-bolt"></i>
                                                            </span> Server #12 overloaded. </span>
                <span className="time">3 mins</span>
              </a>
            </li>
            <li>
              <a href="javascript:;">
                                                        <span className="details">
                                                            <span
                                                              className="label label-sm label-icon label-warning md-skip">
                                                                <i className="fa fa-bell-o"></i>
                                                            </span> Server #2 not responding. </span>
                <span className="time">10 mins</span>
              </a>
            </li>
            <li>
              <a href="javascript:;">
                                                        <span className="details">
                                                            <span className="label label-sm label-icon label-info md-skip">
                                                                <i className="fa fa-bullhorn"></i>
                                                            </span> Application error. </span>
                <span className="time">14 hrs</span>
              </a>
            </li>
            <li>
              <a href="javascript:;">
                                                        <span className="details">
                                                            <span
                                                              className="label label-sm label-icon label-danger md-skip">
                                                                <i className="fa fa-bolt"></i>
                                                            </span> Database overloaded 68%. </span>
                <span className="time">2 days</span>
              </a>
            </li>
            <li>
              <a href="javascript:;">
                                                        <span className="details">
                                                            <span
                                                              className="label label-sm label-icon label-danger md-skip">
                                                                <i className="fa fa-bolt"></i>
                                                            </span> A user IP blocked. </span>
                <span className="time">3 days</span>
              </a>
            </li>
            <li>
              <a href="javascript:;">
                                                        <span className="details">
                                                            <span
                                                              className="label label-sm label-icon label-warning md-skip">
                                                                <i className="fa fa-bell-o"></i>
                                                            </span> Storage Server #4 not responding dfdfdfd. </span>
                <span className="time">4 days</span>
              </a>
            </li>
            <li>
              <a href="javascript:;">
                                                        <span className="details">
                                                            <span className="label label-sm label-icon label-info md-skip">
                                                                <i className="fa fa-bullhorn"></i>
                                                            </span> System Error. </span>
                <span className="time">5 days</span>
              </a>
            </li>
            <li>
              <a href="javascript:;">
                                                        <span className="details">
                                                            <span
                                                              className="label label-sm label-icon label-danger md-skip">
                                                                <i className="fa fa-bolt"></i>
                                                            </span> Storage server failed. </span>
                <span className="time">9 days</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div className="btn-group-red btn-group">
      <button type="button" className="btn btn-sm md-skip dropdown-toggle" data-toggle="dropdown"
              data-hover="dropdown" data-close-others="true">
        <i className="fa fa-plus"></i>
      </button>
      <ul className="dropdown-menu-v2" role="menu">
        <li className="active">
          <a href="#">New Post</a>
        </li>
        <li>
          <a href="#">New Comment</a>
        </li>
        <li>
          <a href="#">Share</a>
        </li>
        <li className="divider"></li>
        <li>
          <a href="#">Comments
            <span className="badge badge-success">4</span>
          </a>
        </li>
        <li>
          <a href="#">Feedbacks
            <span className="badge badge-danger">2</span>
          </a>
        </li>
      </ul>
    </div>
    <div className="btn-group-img btn-group">
      <button type="button" className="btn btn-sm md-skip dropdown-toggle" data-toggle="dropdown"
              data-hover="dropdown" data-close-others="true">
        <span>Hi, Marcus</span>
        <img src="/img/avatar1.jpg" alt=""/></button>
      <ul className="dropdown-menu-v2" role="menu">
        <li>
          <a href="page_user_profile_1.html">
            <i className="fa fa-user"></i> My Profile
            <span className="badge badge-danger">1</span>
          </a>
        </li>
        <li>
          <a href="app_calendar.html">
            <i className="fa fa-calendar"></i> My Calendar </a>
        </li>
        <li>
          <a href="app_inbox.html">
            <i className="fa fa-envelope-open"></i> My Inbox
            <span className="badge badge-danger"> 3 </span>
          </a>
        </li>
        <li>
          <a href="app_todo_2.html">
            <i className="fa fa-rocket"></i> My Tasks
            <span className="badge badge-success"> 7 </span>
          </a>
        </li>
        <li className="divider"></li>
        <li>
          <a href="page_user_lock_1.html">
            <i className="fa fa-lock"></i> Lock Screen </a>
        </li>
        <li>
          <a href="page_user_login_1.html">
            <i className="fa fa-key"></i> Log Out </a>
        </li>
      </ul>
    </div>
    <button type="button" className="quick-sidebar-toggler md-skip" data-toggle="collapse">
      <span className="sr-only">Toggle Quick Sidebar</span>
      <i className="fa fa-sign-out"></i>
    </button>
  </div>
);