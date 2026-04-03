import PropTypes from "prop-types"
import { MdCall, MdChat } from "react-icons/md"

export default function KhachhangSupportHero({ onCallClick, onChatClick }) {
  return (
    <>
      <div className="HeaderBoxKhachHang fixed-bg h-[40%]" />
      <div className="relative h-[100px]">
        <div className="customBG absolute left-1/2 top-[-20px] min-h-[100px] w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 rounded-[10px] border border-[#c9d1d8]">
          <div className="flex min-h-[150px] w-full flex-col rounded-[5px]">
            <div className="flex justify-center px-4 py-4">
              <div className="w-full">
                <p className="mb-2 text-center text-block-acc-name font-bold text-primary">
                  Gắn kết khách hàng
                </p>
                <p className="text-center leading-relaxed text-[#1f2937]">
                  Bạn cần hỗ trợ nhanh, tư vấn hỗ trợ
                  <br />
                  <b className="text-primary">
                    Hãy gửi tin nhắn trực tiếp trên ứng dụng
                  </b>
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="flex w-[80%] gap-5">
                    <button
                      type="button"
                      onClick={onCallClick}
                      className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl border-primary border-2 bg-transparent px-2.5 text-sm font-medium text-primary"
                    >
                      <MdCall size={16} className="text-primary" />
                      Gọi
                    </button>
                    <button
                      type="button"
                      onClick={onChatClick}
                      className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-2.5 text-sm font-medium text-white"
                    >
                      <MdChat size={16} className="text-white" />
                      Nhắn tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

KhachhangSupportHero.propTypes = {
  onCallClick: PropTypes.func.isRequired,
  onChatClick: PropTypes.func.isRequired,
}
