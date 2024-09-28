import RecentUpdates from "../Discussion/Recent Updates/RecentUpdates";
import Header from "../xyzComponents/Header";
import CompaniesList from "./CompaniesList";

const CompaniesMain = () => {
  return (
    <>
      <Header HeaderClassNames="fixed z-10 top-0 left-0 w-full h-16 transition duration-[350ms] navigation flex justify-between items-center border-b-[0.20px] border-b-gray-500 bg-slate-200" />
      <div className="flex justify-end mt-20">
        <RecentUpdates RecentUpdatesClassNames="recentUpdatesContainer h-[90%] fixed top-[10px] left-0 hidden  md:block md:w-[40%] lg:w-[38%] xl:w-[35%] px-7 py-5 rounded-md ml-5 mt-20 lg:h-[85vh] bg-[#f7f7f7] border-[0.5px] border-gray-300" />
        <CompaniesList />
      </div>
    </>
  );
};
export default CompaniesMain;
