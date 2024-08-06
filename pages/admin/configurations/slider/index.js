import React, { useState } from "react";
import { Card, Col, Row, Tab, Tabs } from "react-bootstrap";
import Seo from "@/shared/layout-components/seo/seo";
import Home from "./home";
import AboutUs from "./aboutus";
import Blog from "./blog-block";
import News from "./news-block";
import { useSelector } from "react-redux";

const Tabss = () => {
  const sliderType = useSelector((state) => state?.sliderType);
  return (
    <div>
      <Seo title={"Configurations-slider"} />
      {/* Configuration title start */}
      <Card className="mt-4">
        <Card.Body className="py-0">
          <div className="breadcrumb-header justify-content-between">
            <div className="left-content">
              <span className="main-content-title mg-b-0 mg-b-lg-1">
                Slider
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
      {/* Configuration title end */}

      {/* Row for tabs start */}
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="mg-b-20 shadow-search" id="tabs-style2">
            <Card.Body>
              <div className="text-wrap">
                <div className="example p-0">
                  <div className="panel panel-primary tabs-style-2">
                    <div className=" tab-menu-heading">
                      <div className="tabs-menu1">

                        {/* Tabs start */}
                        <Tabs
                          defaultActiveKey={`${sliderType === 'home' ? 'Tab 01' : sliderType === 'about' ? 'Tab 02' : sliderType === 'blog' ? 'Tab 03' : sliderType === 'news' ? 'Tab 04' : 'Tab 01'}`}

                          // defaultActiveKey="Tab 01"
                          className=" panel-tabs main-nav-line "
                        >

                          {/* Home tab start */}
                          <Tab eventKey="Tab 01" title="Home">
                            <Home />
                          </Tab>
                          {/* Home tab end */}

                          {/* About us tab start */}
                          <Tab eventKey="Tab 02" title="About us">
                            <AboutUs />
                          </Tab>
                          {/* About us tab end */}

                          {/* Blog us tab start */}
                          <Tab eventKey="Tab 03" title="Blog">
                            <Blog />
                          </Tab>
                          {/* Blog us tab end */}

                          {/* News us tab start */}
                          <Tab eventKey="Tab 04" title="News">
                            <News />
                          </Tab>
                          {/* News us tab end */}

                        </Tabs>
                        {/* Tabs end */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Row for tabs end */}


    </div>
  );
};

Tabss.propTypes = {};

Tabss.defaultProps = {};

Tabss.layout = "Contentlayout";

export default Tabss;
