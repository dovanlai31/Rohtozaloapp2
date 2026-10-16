import AccountDoanhSoSection from "@components/Account/AccountDoanhSoSection"
import AccountHeader from "@components/Account/AccountHeader"
import AccountOrderSections from "@components/Account/AccountOrderSections"
import AccountPosmSection from "@components/Account/AccountPosmSection"
import AccountProfileCard from "@components/Account/AccountProfileCard"
import AccountStatsGrid from "@components/Account/AccountStatsGrid"
import { useAccountPage } from "@hooks/useAccountPage"
import { Box, Page } from "zmp-framework/react"

const AccountPage = () => {
  const {
    user,
    PhoneNumner,
    CusInfo,
    dataDoanhSo,
    SoLuongDonHang,
    posmSummary,
    checkPhonePermissionAndContinue,
  } = useAccountPage()

  return (
    <Page className="home-page min-h-screen bg-slate-50">
      <AccountHeader phoneNumber={PhoneNumner} />

      <AccountProfileCard
        user={user}
        cusInfo={CusInfo}
        phoneNumber={PhoneNumner}
        onRegisterClick={checkPhonePermissionAndContinue}
      />

      <AccountStatsGrid soLuongDonHang={SoLuongDonHang} dataDoanhSo={dataDoanhSo} />

      <AccountDoanhSoSection dataDoanhSo={dataDoanhSo} />

      <AccountOrderSections
        soLuongDonHang={SoLuongDonHang}
        showPreorder={!!CusInfo.xemDonDatHangZalo}
      />

      <AccountPosmSection posmSummary={posmSummary} />

      <Box noSpace={true} flex alignItems="center" justifyContent="space-between">
        <Box flex alignItems="center" m={5} py={7}></Box>
      </Box>
    </Page>
  )
}

export default AccountPage
