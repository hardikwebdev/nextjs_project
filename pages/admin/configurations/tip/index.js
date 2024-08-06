

import React, { useState } from "react";
import { Card, Col, Row, Tab, Tabs } from "react-bootstrap";
import Seo from "@/shared/layout-components/seo/seo";
import Block from "./block";
import Header from "./header"
import { useSelector } from "react-redux";


const tipBlock = () => {
    const sliderType = useSelector((state) => state?.sliderType);

    return (
        <div>
            <Seo title={"Configurations"} />
            {/* Configuration title start */}
            <Card className="mt-4">
                <Card.Body className="py-0">
                    <div className="breadcrumb-header justify-content-between">
                        <div className="left-content">
                            <span className="main-content-title mg-b-0 mg-b-lg-1">
                                Tip
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
                                                    defaultActiveKey={`${sliderType === 'tip' ? 'Tab 01' : sliderType === 'header' ? 'Tab 02': 'Tab 01'}`}
                                                    className=" panel-tabs main-nav-line "
                                                >

                                                    {/* Home tab start */}
                                                    <Tab eventKey="Tab 01" title="Block">
                                                        <Block />
                                                    </Tab>
                                                    <Tab eventKey="Tab 02" title="Header">
                                                        <Header />
                                                    </Tab>
                                                    {/* Home tab end */}

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

tipBlock.propTypes = {};

tipBlock.defaultProps = {};

tipBlock.layout = "Contentlayout";

export default tipBlock;
