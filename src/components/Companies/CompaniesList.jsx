import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import CompanyCard from "./CompanyCard";
import Pagination from "./Pagination";

const CompaniesList = () => {
  const companiesData = useSelector(
    (store) => store.companiesData.initialCompanies
  );
  return (
    <div className="w-full md:w-[55%] lg:mr-10 mx-10 md:mx-5">
      <h1 className="font-semibold text-2xl">
        Placement Drives In Our Campus @ <span className="">AUMP</span> 
      </h1>
      {companiesData.map((company, Index) => (
        <CompanyCard
          key={nanoid()}
          companyName={company.NameOfCompany}
          CTC={company.AnnualCTC}
          Location={company.Location}
          ForBatch={company.ForBatch}
          ProfileOffered={company.ProfileOffered}
          FunctinalArea={company.FunctinalArea}
          Round1={company.Round1}
          Round2={company.Round2}
          Round3={company.Round3}
          Round4={company.Round4}
          Website={company.Website}
          logo={company.logo}
        />
      ))}
      <Pagination />
    </div>
  );
};
export default CompaniesList;
