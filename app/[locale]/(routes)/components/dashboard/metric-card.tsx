import { Card } from "@/components/ui/card";

interface Props {
  title: string;
  icon: React.ReactNode;
  metricValue: string | number;
  metricLabel?: string;
}

const MetricCard = ({ title, icon, metricValue, metricLabel }: Props) => {
  return (
    <Card className="flex rounded-[20px] border-hidden blur-sm" >
      <div className="flex px-[14px] py-[20px]">
        <div className="flex items-center">
          <div className="flex flex-1 items-center justify-center w-[46px] h-[46px] bg-light-purple rounded-[23px]">
            {icon}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start justify-center ml-[8px]">
          <div className="text-light-gray text-[12px] font-[400]">{title}</div>
          <div className="flex text-[24px] font-[700]">
            {metricValue}
            {metricLabel && <div className="flex text-[10px] font-[400] text-primary items-end">{metricLabel}</div>}
          </div>
        </div>
      </div>
    </Card >
  );
}

export default MetricCard