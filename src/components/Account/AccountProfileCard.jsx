import { formatCurrency } from "@utils/networking"
import { FaUser } from "react-icons/fa"
import { FaCircleXmark } from "react-icons/fa6"
import { Box, Button, Icon, Link, Text } from "zmp-framework/react"
import UserImg from "../../static/images/user.png"

function AvatarCameraBadge() {
  return (
    <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-500"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </div>
  )
}

export default function AccountProfileCard({
  user,
  cusInfo,
  phoneNumber,
  onRegisterClick,
}) {
  const isSynced = cusInfo.KHACHHANG_fk !== 0

  return (
    <div className="mx-4 mb-3 mt-11">
      <div className="relative rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="relative flex flex-col items-center rounded-t-2xl bg-gradient-to-b from-sky-100/90 via-blue-50/50 to-white px-4 pb-4 pt-14">
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <img
                loading="lazy"
                src={user?.avatar || UserImg}
                alt="avatar"
                className="h-20 w-20 rounded-full border-[3px] border-white object-cover shadow-md"
              />
              <AvatarCameraBadge />
            </div>
          </div>

          <span className="mb-1 text-center text-lg font-bold text-primary">
            {cusInfo.tenkh || "---"}
          </span>

          <span className="mb-2.5 text-center text-[13px] text-gray-500">
            {cusInfo.DIENTHOAI || phoneNumber || ""}
          </span>

          <div
            className={
              isSynced
                ? "inline-flex items-center gap-1.5 rounded-full border border-green-500 bg-green-50 px-3.5 py-1 text-xs font-semibold text-green-700"
                : "inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-3.5 py-1 text-xs font-semibold text-red-600"
            }
          >
            {isSynced ? (
              <>
                <FaUser size={12} className="text-green-600" />
                Khách hàng
              </>
            ) : (
              <>
                <FaCircleXmark size={13} />
                Chưa đồng bộ
              </>
            )}
          </div>

          {(cusInfo?.KHACHHANG_fk || 0) === 0 && (
            <Box
              className="w-full"
              my="5"
              flex
              justifyContent="center"
              alignItems="center"
            >
              <Link
                onClick={onRegisterClick}
                animate
                noLinkClass
                className="block w-full px-4"
              >
                <Text className="mb-2 text-center text-xs font-bold leading-relaxed text-gray-600">
                  Số điện thoại chưa được đồng bộ với hệ thống
                  <br />
                  Vui lòng đăng ký
                </Text>
                <Button
                  className="filter-button-App !mx-auto !my-2 block"
                  typeName="primary"
                  text="Đăng ký"
                />
              </Link>
            </Box>
          )}
        </div>

        <div className="flex rounded-b-2xl border-t border-[#F2F2F2] ">
          <Link
            href="/TichLuyList/"
            noLinkClass
            className="flex flex-1 flex-row items-center gap-2.5 border-r border-[#F2F2F2] px-4 py-3 active:bg-gray-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-lg">
              🎖️
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-gray-500">Cấp độ</div>
              <div className="text-sm font-bold ">{cusInfo?.capdo || "Hạng D"}</div>
            </div>
            <Icon
              zmp="zi-chevron-right"
              className="shrink-0 text-sm text-gray-400"
            />
          </Link>
          <Link
            href="/lichsutichdiem/"
            noLinkClass
            className="flex flex-1 flex-row items-center gap-2.5 px-4 py-3 active:bg-gray-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-lg">
              🪙
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-gray-500">Điểm tích lũy</div>
              <div className="text-sm font-bold text-primary">
                {formatCurrency(cusInfo?.diem ?? 0, true)}
              </div>
            </div>
            <Icon
              zmp="zi-chevron-right"
              className="shrink-0 text-sm text-gray-400"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
