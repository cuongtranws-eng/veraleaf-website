export type Lang = 'vi' | 'en';
export type Entry = { slug: string; vi: string; en: string; descriptionVi?: string; descriptionEn?: string };
export const expertise: Entry[] = [
 {slug:'development-consulting',vi:'Tư vấn phát triển',en:'Development Consulting',descriptionVi:'Tư vấn chính sách, chương trình và sáng kiến phát triển theo cách tiếp cận dựa trên bằng chứng.',descriptionEn:'Evidence-informed advice for policies, programmes and development initiatives.'},
 {slug:'project-assessment',vi:'Khảo sát, đánh giá dự án',en:'Project Surveys & Evaluation',descriptionVi:'Khảo sát thực địa, đánh giá đầu kỳ, giữa kỳ và cuối kỳ, đo lường hiệu quả và tác động của dự án.',descriptionEn:'Field surveys and baseline, mid-term and final evaluations measuring project effectiveness and impact.'},
 {slug:'environmental-consulting',vi:'Tư vấn môi trường',en:'Environmental Consulting',descriptionVi:'Tư vấn về tài nguyên, hệ sinh thái và các giải pháp quản lý môi trường.',descriptionEn:'Advice on natural resources, ecosystems and environmental management solutions.'},
 {slug:'ghg-inventory',vi:'Dịch vụ kiểm kê khí nhà kính',en:'Greenhouse Gas Inventory Services',descriptionVi:'Kiểm kê khí nhà kính, thẩm tra, thẩm định báo cáo kiểm kê theo tiêu chuẩn quốc gia và quốc tế; tư vấn lộ trình Net Zero.',descriptionEn:'GHG inventories, verification and validation of inventory reports to national and international standards; Net Zero roadmaps.'},
 {slug:'gis-remote-sensing',vi:'GIS và viễn thám',en:'GIS & Remote Sensing',descriptionVi:'Ứng dụng GIS, ảnh vệ tinh và UAV trong phân tích không gian và giám sát.',descriptionEn:'GIS, satellite imagery and UAV applications for spatial analysis and monitoring.'},
 {slug:'education-consulting',vi:'Tư vấn giáo dục',en:'Education Consulting',descriptionVi:'Nghiên cứu, đánh giá và tư vấn các sáng kiến nâng cao chất lượng giáo dục.',descriptionEn:'Research, evaluation and advice on initiatives to improve education quality.'},
];
export const about:Entry[]=[
 {slug:'general-information',vi:'Thông tin chung',en:'General Information'},
 {slug:'organizational-structure',vi:'Sơ đồ tổ chức',en:'Organizational Structure'},
 {slug:'consultants',vi:'Đội ngũ tư vấn',en:'Our Consultants'},
];
export const projectTabs:Entry[]=[{slug:'all',vi:'Tất cả dự án',en:'All Projects'},{slug:'ongoing',vi:'Đang triển khai',en:'Ongoing Projects'},{slug:'completed',vi:'Đã hoàn thành',en:'Completed Projects'}];
export const insightTabs:Entry[]=[{slug:'news',vi:'Tin tức & Hoạt động',en:'News & Updates'},{slug:'articles',vi:'Bài viết chuyên môn',en:'Insights & Articles'},{slug:'publications',vi:'Nghiên cứu & Ấn phẩm',en:'Research & Publications'}];
export const menus=[
 {slug:'',vi:'Trang chủ',en:'Home'},
 {slug:'about',vi:'Về chúng tôi',en:'About Us',children:about},
 {slug:'expertise',vi:'Lĩnh vực hoạt động',en:'Expertise',children:expertise},
 {slug:'projects',vi:'Dự án',en:'Projects',children:projectTabs},
 {slug:'insights',vi:'Góc nhìn',en:'Insights',children:insightTabs},
 {slug:'partners',vi:'Đối tác',en:'Partners'},
 {slug:'contact',vi:'Liên hệ',en:'Contact'},
];
export function url(lang:Lang,section:string,child?:string){return '/'+lang+(section?'/'+section:'')+(child?'/'+child:'');}
