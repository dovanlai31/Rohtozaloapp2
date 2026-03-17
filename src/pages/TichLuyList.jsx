import {
  Box,
  Link,
  Page,
  Tab,
  Tabbar,
  Tabs,
  Text,
  useStore,
  zmp,
} from "zmp-framework/react";
import { useEffect, useState } from "react";
import HeaderBack from "@components/Header/HeaderBack";
import { MdCardGiftcard } from "react-icons/md";
import Color from "@components/common/Color";
import { formatCurrency, request } from "@utils/networking";
import { formatDateToDDMMYYYY } from "@utils/util";
import { FaInbox } from "react-icons/fa6";
import store from "../store";
import ProgressBar from "@ramonak/react-progress-bar";
import { ConvertOpacity } from "@utils/ConvertOpacity";
import LoadingSpinner from "@components/LoadingSpinner";

const TichLuyList = () => {
  const CusInfo = store.getters.getCusInfo.value || {};
  const [listDangThamGia, setListDangThamGia] = useState([]);
  const [listDaThamGia, setListDaThamGia] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log('log__x', listDaThamGia);
  const getListTichLuy = async () => {
    const method = "khuyenmai/getCTTLKH_List";
    const params = {
      userId: String(CusInfo?.KHACHHANG_fk),
      type: String(1),
    };
    const params2 = {
      userId: String(CusInfo?.KHACHHANG_fk),
      type: String(2),
    };

    try {
      const post1 = await request("POST", method, params);
      const res1 = await post1.json();

      const post2 = await request("POST", method, params2);
      const res2 = await post2.json();
      console.log('res2:', res2);
      if (res1?.result && res1?.message) {
        setListDangThamGia(JSON.parse(res1.message));
      }
      if (res2?.result && res2?.message) {
        setListDaThamGia(JSON.parse(res2.message));
      }
    } catch (error) {
      console.log("❌ Lỗi getCTTLKH_List:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListTichLuy();
  }, []);

  const renderItem = (item, index) => (
    console.log('itemx', item),  
      <Box
      key={index}
      className="list-item-km2 "
      style={{
        borderRadius: 12,
        background: "linear-gradient(135deg, #ffffff, #f8fbff)",
        marginBottom: 14,
        border: "1px solid #e4e9f0",
        overflow: "hidden",
      }}
    >
      <Link animate noLinkClass href={`/PageTichLuyDetail/?pk_seq=${item?.CTTL_FK}`}>
        <Box flex alignItems="center" p={2}>
          {/* Icon */}
          <Box
            style={{
              width: 55,
              height: 55,
              borderRadius: 8,
              background: ConvertOpacity(Color.textAPPRedChill, 0.1 ),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            <MdCardGiftcard size={26} color={Color.textAPPRedChill} />
          </Box>

          {/* Text */}
          <Box
            flex
            flexDirection="column"
            justifyContent="flex-start"
        
            flexWrap="wrap"
            style={{ width: "100%", padding: 10, }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: Color.ColorGesoNewLight,
                marginBottom: 3,
                whiteSpace: "normal",  
                wordWrap: "break-word", 
                overflowWrap: "break-word", 
              }}
            >
              {item.TenChuongTrinh} 
            </Text>

            <Text style={{ fontSize: 12, color: Color.textAPPGray, marginBottom: 3 }}>
              {item.TuNgay
                ? `${formatDateToDDMMYYYY(item.TuNgay)} đến ${formatDateToDDMMYYYY(
                    item.DenNgay
                  )}`
                : ""}
            </Text>

            <Text style={{ fontSize: 12,  color: Color.ColorGesoBlueBold, marginBottom: 2 }}>
              <b>Cam kết:</b> {formatCurrency(item.DoanhSoDangKy ?? 0, true)}
            </Text>
            <Text style={{ fontSize: 12, color: Color.ColorGesoBlueBold, marginBottom: 6 }}>
              <b>Thực hiện:</b> {formatCurrency(item.DoanhThuDat ?? 0, true)}
            </Text>

            {/* Thanh tiến độ mới */}
            <ProgressBar
              completed={item.PhanTram ?? 0}
              bgColor={
                (item.PhanTram ?? 0) >= 100
                  ? "linear-gradient(90deg, #4caf50, #81c784)"
                  : Color.primary
              }
              baseBgColor="#e0e0e0"
              height="8px"
              borderRadius="5px"
              animateOnRender
              isLabelVisible={false} // 🔥 Ẩn label
            />

            <Text
              style={{
                fontSize: 11,
                color:
                  (item.PhanTram ?? 0) >= 100
                    ? Color.mainColor
                    : Color.mainColor,
                marginTop: 5,
              }}
            >
              Hoàn thành: {(item.PhanTram ?? 0).toFixed(1)}%
            </Text>
          </Box>
        </Box>
      </Link>
    </Box>
  );

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav");
      }}
      className="detail-page"
    >
      <HeaderBack
        slot="fixed"
        icon={<MdCardGiftcard size={25} className="text-blue-imex" />}
        title="Chương trình tích lũy"
      />

      {/* Tabs */}
      <Box m={0} slot="fixed" p={0}>
        <Tabbar inner={false} m={0} p={0} className="CustomTabbar">
          <Link style={{ fontSize: "14px" }} tabLink="#tab-dang" tabLinkActive>
            Đang tham gia
          </Link>
          <Link style={{ fontSize: "14px" }} tabLink="#tab-da">
            Đã tham gia
          </Link>
        </Tabbar>
      </Box>

      {/* Nội dung Tabs */}
      <Box
        className="latest"
        mt="1"
        flex
        flexDirection="column"
        justifyContent="space-between"
      >
        <Tabs m={5} animated swipeable>
          {/* Tab 1: Đang tham gia */}
          <Tab id="tab-dang" tabActive>
            <Box className="view-center-gh" p="0" style={{ paddingBottom: 200 }}>
              {loading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner />{" "}
                      <span className="font-semibold">Đang tải dữ liệu...</span>
                    </div>
              ) : listDangThamGia.length === 0 ? (
                <div className="flex flex-col justify-center items-center">
                  <FaInbox size={25} color="#ccc" />
                  <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                    Không có chương trình đang tham gia
                  </Text>
                </div>
              ) : (
                listDangThamGia.map(renderItem)
              )}
            </Box>
          </Tab>

          {/* Tab 2: Đã tham gia */}
          <Tab id="tab-da">
            <Box className="view-center-gh" p="0" style={{ paddingBottom: 200 }}>
              {loading ? (
                <Text style={{ textAlign: "center", color: "#888" }}>
                  Đang tải...
                </Text>
              ) : listDaThamGia.length === 0 ? (
                <div className="flex flex-col justify-center items-center">
                  <FaInbox size={25} color="#ccc" />
                  <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                    Không có chương trình đã tham gia
                  </Text>
                </div>
              ) : (
                listDaThamGia.map(renderItem)
              )}
            </Box>
          </Tab>
        </Tabs>
      </Box>
    </Page>
  );
};

export default TichLuyList;
