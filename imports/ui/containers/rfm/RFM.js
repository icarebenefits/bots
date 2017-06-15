import React, {PropTypes} from 'react';

const RFM = () => {
  return (
    <div className="page-content-row">
      <div className="page-content-col">
        <div className="row">
          <div className="col-md-4">
            <div className="row">
              <div className="col-md-8">
                <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                  <h4 className="widget-thumb-heading">Active</h4>
                  <div className="widget-thumb-wrap">
                    <i className="widget-thumb-icon bg-green icon-bulb"></i>
                    <div className="widget-thumb-body">
                      <span className="widget-thumb-subtitle">iCare members</span>
                      <span className="widget-thumb-body-stat" data-counter="counterup" data-value="7,644">1,484</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                  <h4 className="widget-thumb-heading">Total</h4>
                  <div className="widget-thumb-wrap">
                    <i className="widget-thumb-icon bg-green icon-bulb"></i>
                    <div className="widget-thumb-body">
                      <span className="widget-thumb-subtitle">iCare members</span>
                      <span className="widget-thumb-body-stat" data-counter="counterup"
                            data-value="7,644">128,007</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="portlet light bordered">
              <div className="portlet-title tabbable-line">
                <div className="caption">
                  <i className="icon-bubbles font-dark hide"></i>
                  <span className="caption-subject font-dark bold uppercase">With 1,484 active customers</span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="btn-group btn-group btn-group-justified">
                  <a id="1-1" href="" className="btn btn-danger btn-lg btn-graphic" disabled>{`Can't lose them (0)`}</a>
                  <a id="1-2" href="" className="btn yellow btn-lg btn-graphic" disabled>{`At risk (10)`}</a>
                  <a id="1-3" href="" className="btn green-haze btn-lg btn-graphic" disabled></a>
                  <a id="1-4" href="" className="btn green-haze btn-lg btn-graphic"
                     disabled>{`Loyal customers (149)`}</a>
                  <a id="1-5" href="" className="btn btn-success btn-lg btn-graphic" disabled>{`Champions (20)`}</a>
                </div>
                <div className="btn-group btn-group btn-group-justified">
                  <a id="2-1" href="" className="btn yellow btn-lg btn-graphic" disabled></a>
                  <a id="2-2" href="" className="btn yellow btn-lg btn-graphic" disabled></a>
                  <a id="2-3" href="" className="btn green-haze btn-lg btn-graphic" disabled></a>
                  <a id="2-4" href="" className="btn green-haze btn-lg btn-graphic" disabled></a>
                  <a id="2-5" href="" className="btn green-haze btn-lg btn-graphic" disabled></a>
                </div>
                <div className="btn-group btn-group btn-group-justified">
                  <a id="3-1" href="" className="btn yellow btn-lg btn-graphic" disabled></a>
                  <a id="3-2" href="" className="btn yellow btn-lg btn-graphic" disabled></a>
                  <a id="3-3" href="" className="btn blue btn-lg btn-graphic" disabled>{`Need attention (0)`}</a>
                  <a id="3-4" href="" className="btn green btn-lg btn-graphic" disabled></a>
                  <a id="3-5" href="" className="btn green btn-lg btn-graphic"
                     disabled>{`Potential loyalist (1,262)`}</a>
                </div>
                <div className="btn-group btn-group btn-group-justified">
                  <a id="4-1" href="" className="btn grey-cascade btn-lg btn-graphic" disabled></a>
                  <a id="4-2" href="" className="btn btn-default btn-lg btn-graphic" disabled>{`hibernating (43)`}</a>
                  <a id="4-3" href="" className="btn blue-hoki btn-lg btn-graphic" disabled>{`About to sleep (0)`}</a>
                  <a id="4-4" href="" className="btn green btn-lg btn-graphic" disabled></a>
                  <a id="4-5" href="" className="btn green btn-lg btn-graphic" disabled></a>
                </div>
                <div className="btn-group btn-group btn-group-justified">
                  <a id="5-1" href="" className="btn grey-cascade btn-lg btn-graphic" disabled></a>
                  <a id="5-2" href="" className="btn grey-cascade btn-lg btn-graphic" disabled>{`Lost (0)`}</a>
                  <a id="5-3" href="" className="btn blue-hoki btn-lg btn-graphic" disabled></a>
                  <a id="5-4" href="" className="btn purple-sharp btn-lg btn-graphic" disabled>{`Promissing (0)`}</a>
                  <a id="5-5" href="" className="btn btn-default btn-lg btn-graphic" disabled>{`New customers (0)`}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="portlet light bordered">
              <div className="portlet-title">
                <div className="caption">
                  <i className="fa fa-bubble font-dark hide"></i>
                  <span className="caption-subject font-hide bold uppercase">Top Customers</span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="mt-widget-1">
                      <div className="mt-fa fa">
                        <a className="item-name primary-link" href="#">
                          The Best Champion
                        </a>
                      </div>
                      <div className="mt-img">
                        <img className="img-responsive img-widget" src="/img/social/hellboy-icon.png"/></div>
                      <div className="mt-body">
                        <h3 className="mt-username">Dung Trung T</h3>
                        <p className="mt-user-title">Viet Phu Payment Solution Joint Stock Company (MBV)</p>
                        <div className="mt-stats">
                          <div className="btn-group btn-group btn-group-justified">
                            <a href="" className="btn font-green">Recency</a>
                            <a href="" className="btn font-red">Frequency</a>
                            <a href="" className="btn font-yellow">Monetary</a>
                          </div>
                          <div className="btn-group btn-group btn-group-justified">
                            <a href="" className="btn font-green">
                              <i className="fa fa-social-twitter"></i>5 days</a>
                            <a href="" className="btn font-red">
                              <i className="fa fa-bubbles"></i>56 SOs</a>
                            <a href="" className="btn font-yellow">
                              <i className="fa fa-emotfa fa-smile"></i>100m VND</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mt-widget-1">
                      <div className="mt-fa fa">
                        <a className="item-name primary-link" href="#">
                          The Best Loyal Customer
                        </a>
                      </div>
                      <div className="mt-img">
                        <img className="img-responsive img-widget" src="/img/social/funny-icon-22153.png"/></div>
                      <div className="mt-body">
                        <h3 className="mt-username">Nguyễn Tiến Hà</h3>
                        <p className="mt-user-title">iCare Benefits Vietnam</p>
                        <div className="mt-stats">
                          <div className="btn-group btn-group btn-group-justified">
                            <a href="" className="btn font-green">Recency</a>
                            <a href="" className="btn font-red">Frequency</a>
                            <a href="" className="btn font-yellow">Monetary</a>
                          </div>
                          <div className="btn-group btn-group btn-group-justified">
                            <a href="" className="btn font-green">
                              <i className="fa fa-social-twitter"></i>61 days</a>
                            <a href="" className="btn font-red">
                              <i className="fa fa-bubbles"></i>84 SOs</a>
                            <a href="" className="btn font-yellow">
                              <i className="fa fa-emotfa fa-smile"></i>2,2m VND</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mt-widget-1">
                      <div className="mt-fa fa">
                        <a className="item-name primary-link" href="#">
                          The Best Potential Loyalist
                        </a>
                      </div>
                      <div className="mt-img">
                        <img className="img-responsive img-widget" src="/img/social/funny-icon-22166.jpg"/></div>
                      <div className="mt-body">
                        <h3 className="mt-username">NGUYỄN THỊ THƯƠNG</h3>
                        <p className="mt-user-title">CÔNG TY TNHH SUNGJIN INC VINA</p>
                        <div className="mt-stats">
                          <div className="btn-group btn-group btn-group-justified">
                            <a href="" className="btn font-green">Recency</a>
                            <a href="" className="btn font-red">Frequency</a>
                            <a href="" className="btn font-yellow">Monetary</a>
                          </div>
                          <div className="btn-group btn-group btn-group-justified">
                            <a href="" className="btn font-green">
                              <i className="fa fa-social-twitter"></i>2 days</a>
                            <a href="" className="btn font-red">
                              <i className="fa fa-bubbles"></i>4 SOs</a>
                            <a href="" className="btn font-yellow">
                              <i className="fa fa-emotfa fa-smile"></i>6m VND</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="portlet light bordered">
              <div className="portlet-title tabbable-line">
                <div className="caption">
                  <i className="icon-bubbles font-dark hide"></i>
                  <span className="caption-subject font-dark bold uppercase">Top 10 Champions</span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="tab-content">
                  <div className="tab-pane active" id="portlet_comments_1">
                    <div className="mt-comments">
                      <div className="mt-comment">
                        <div class="mt-comment-img">1</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Dung Trung T</span>
                            <span className="mt-comment-date">100,000,000 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            Viet Phu Payment Solution Joint Stock Company (MBV)
                          </div>
                        </div>
                      </div>
                      <div className="mt-comment">
                        <div class="mt-comment-img">2</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Nguyễn Huỳnh Đức Nhân</span>
                            <span className="mt-comment-date">17,989,900 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            Viet Phu Payment Solution Joint Stock Company (MBV)
                          </div>
                        </div>
                      </div>
                      <div className="mt-comment">
                        <div class="mt-comment-img">3</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Đinh Phượng Linh</span>
                            <span className="mt-comment-date">31,829,000 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            Viet Phu Payment Solution Joint Stock Company (MBV)
                          </div>
                        </div>
                      </div>
                      <div className="mt-comment">
                        <div class="mt-comment-img">4</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Ryan walter Galloway</span>
                            <span className="mt-comment-date">35,487,972 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            The standard chunk of Lorem or non-characteristic Ipsum used since the 1500s or non-characteristic.
                          </div>
                        </div>
                      </div>
                      <div className="mt-comment">
                        <div class="mt-comment-img">5</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Vũ Thị Yến Xuân</span>
                            <span className="mt-comment-date">9,450,000 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            Viet Phu Payment Solution Joint Stock Company (MBV)
                          </div>
                        </div>
                      </div>
                      <div className="mt-comment">
                        <div class="mt-comment-img">6</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Diệp Thị Mỹ Hảo</span>
                            <span className="mt-comment-date">38,902,000 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            Viet Phu Payment Solution Joint Stock Company (MBV)
                          </div>
                        </div>
                      </div>
                      <div className="mt-comment">
                        <div class="mt-comment-img">7</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Trương Hoàng Nam</span>
                            <span className="mt-comment-date">76,846,000 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            Viet Phu Payment Solution Joint Stock Company (MBV)
                          </div>
                        </div>
                      </div>
                      <div className="mt-comment">
                        <div class="mt-comment-img">8</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Diệp Gia Huy</span>
                            <span className="mt-comment-date">15,999,000 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            Viet Phu Payment Solution Joint Stock Company (MBV)
                          </div>
                        </div>
                      </div>
                      <div className="mt-comment">
                        <div class="mt-comment-img">9</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Nguyễn Thanh Trúc</span>
                            <span className="mt-comment-date">9,772,000 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            Cat Minh
                          </div>
                        </div>
                      </div>
                      <div className="mt-comment">
                        <div class="mt-comment-img">10</div>
                        <div className="mt-comment-body">
                          <div className="mt-comment-info">
                            <span className="mt-comment-author">Bùi Văn Xuân</span>
                            <span className="mt-comment-date">9,490,000 VND</span>
                          </div>
                          <div className="mt-comment-text">
                            Viet Phu Payment Solution Joint Stock Company (MBV)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFM