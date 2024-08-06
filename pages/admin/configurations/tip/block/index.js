import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, Modal, OverlayTrigger, Tooltip, Pagination, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { getHomeBlock, updateHomeBlock } from "../../../../../shared/services/Admin_Apis/homeBlock/homeBlockCrud";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData } from "@/shared/redux/actions/authAction";


export default function Block() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch();
  let navigate = useRouter();

  const accessToken = useSelector((state) => state?.userData?.access_token);

  const getData = () => {

    getHomeBlock(accessToken, "tipblock")
      .then(({ data }) => {
        setData(data.existingHomeBlockConfiguration);
        setLoading(false);
      })
      .catch((error) => {
        if (error?.response?.data?.description) {
          toast.error(error?.response?.data?.description, {
            theme: "dark",

          });
          setLoading(false);
        } else {
          toast.error(error?.response?.data?.message[0], {
            theme: "dark",
          });
          setLoading(false);
        }
        if (error?.response?.data?.statusCode === 401) {
          dispatch(setUserData(null));
          let path = `/admin/login`;
          navigate.push(path);
          setLoading(false);
        }

      })
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <>
      <div
        className="panel-body tabs-menu-body main-content-body-right"
        id="tab4"
      >
        {loading ?
          <div className="text-center">
            <div className="lds-spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          :
          <>
            {/* Table start */}
            < Row className=" row-sm">
              <Col lg={12} className="mt-5">
                <Card className="custom-card m-0">
                  <div className="table-responsive">
                    <table className="table  table-bordered user-table m-0">
                      <thead>
                        <tr>
                          <th>Sr</th>
                          <th className="min-wdth-200">Header text</th>
                          <th className="wd-150">Banner image</th>
                          <th className="action-btns text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>

                        <tr key={data.id}>
                          <th className="text-center">1</th>
                          <td>
                            <div className="d-flex align-items-center">
                              <span>{data.header_text}</span>
                            </div>
                          </td>
                          <td className="config-banner-img">
                            <img src={data.media} alt="" />
                          </td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}
                              >
                                <Link
                                  href={`/admin/configurations/tip/block/Edit-block`}
                                  className="fe fe-edit"
                                ></Link>
                              </OverlayTrigger>

                            </div>
                          </td>
                        </tr>
                      </tbody>

                    </table>
                  </div>
                </Card>
              </Col>
            </Row>
            {/* Table end */}

            <ToastContainer />
          </>
        }
      </div >
    </>
  );
}
