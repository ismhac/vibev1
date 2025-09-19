import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguage = 'en';
  private translations: Record<string, Record<string, string>> = {
    en: {
      'navbar.logo': 'FPT Software',
      'navbar.home': 'Home',
      'navbar.about': 'About',
      'navbar.industries': 'Industries',
      'navbar.announcements': 'Announcements',
      'navbar.contact': 'Contact',
      'footer.contactUs': 'Contact us',
      'footer.aboutUs': 'About us',
      'footer.statistics': 'Statistics',
      'footer.address': 'FPT Software Building',
      'footer.location': 'Keangnam Hanoi Landmark Tower',
      'footer.city': 'Hanoi, Vietnam',
      'footer.phone': '+84 24 7300 8866',
      'footer.email': 'contact@fpt-software.com',
      'footer.description1':
        'FPT Software is a leading technology corporation in Vietnam, providing innovative software solutions and digital transformation services globally.',
      'footer.description2':
        'We specialize in software development, AI, blockchain, and cloud computing solutions for enterprises worldwide.',
      'footer.visitorsToday': 'Visitors Today',
      'footer.yearsExperience': 'Years Experience',
      'footer.countriesServed': 'Countries Served',
      'footer.copyright': 'FPT Software. All rights reserved.',
      'common.language': 'Language',
      'common.english': 'English',
      'common.vietnamese': 'Tiếng Việt',
      'industries.title': 'Industries We Serve',
      'industries.description':
        'Discover the diverse industries where FPT Software delivers innovative solutions and digital transformation services.',
      'industries.loading': 'Loading industries...',
      'industries.services': 'Key Services',
      'industries.more': 'more',
      'industries.learnMore': 'Learn More',
      'industries.noIndustries': 'No industries available at the moment.',
      'industries.retry': 'Retry',
      'industryDetail.loading': 'Loading industry details...',
      'industryDetail.backToIndustries': 'Back to Industries',
      'industryDetail.services': 'Our Services',
      'announcements.title': 'Latest Announcements',
      'announcements.description':
        'Stay updated with the latest news, press releases, and company updates from FPT Software.',
      'announcements.loading': 'Loading announcements...',
      'announcements.priority.high': 'High Priority',
      'announcements.priority.medium': 'Medium Priority',
      'announcements.priority.low': 'Low Priority',
      'announcements.minRead': 'min read',
      'announcements.more': 'more',
      'announcements.noAnnouncements':
        'No announcements available at the moment.',
      'announcements.retry': 'Retry',
      'announcements.showing': 'Showing',
      'announcements.of': 'of',
      'announcements.items': 'items',
    },
    vi: {
      'navbar.logo': 'FPT Software',
      'navbar.home': 'Trang chủ',
      'navbar.about': 'Giới thiệu',
      'navbar.industries': 'Lĩnh vực',
      'navbar.announcements': 'Thông báo',
      'navbar.contact': 'Liên hệ',
      'footer.contactUs': 'Liên hệ với chúng tôi',
      'footer.aboutUs': 'Về chúng tôi',
      'footer.statistics': 'Thống kê',
      'footer.address': 'Tòa nhà FPT Software',
      'footer.location': 'Keangnam Hanoi Landmark Tower',
      'footer.city': 'Hà Nội, Việt Nam',
      'footer.phone': '+84 24 7300 8866',
      'footer.email': 'contact@fpt-software.com',
      'footer.description1':
        'FPT Software là tập đoàn công nghệ hàng đầu tại Việt Nam, cung cấp các giải pháp phần mềm sáng tạo và dịch vụ chuyển đổi số toàn cầu.',
      'footer.description2':
        'Chúng tôi chuyên về phát triển phần mềm, AI, blockchain và các giải pháp điện toán đám mây cho các doanh nghiệp trên toàn thế giới.',
      'footer.visitorsToday': 'Lượt truy cập hôm nay',
      'footer.yearsExperience': 'Năm kinh nghiệm',
      'footer.countriesServed': 'Quốc gia phục vụ',
      'footer.copyright': 'FPT Software. Bảo lưu mọi quyền.',
      'common.language': 'Ngôn ngữ',
      'common.english': 'English',
      'common.vietnamese': 'Tiếng Việt',
      'industries.title': 'Các Lĩnh Vực Chúng Tôi Phục Vụ',
      'industries.description':
        'Khám phá các lĩnh vực đa dạng nơi FPT Software cung cấp các giải pháp sáng tạo và dịch vụ chuyển đổi số.',
      'industries.loading': 'Đang tải các lĩnh vực...',
      'industries.services': 'Dịch Vụ Chính',
      'industries.more': 'thêm',
      'industries.learnMore': 'Tìm Hiểu Thêm',
      'industries.noIndustries': 'Hiện tại chưa có lĩnh vực nào.',
      'industries.retry': 'Thử Lại',
      'industryDetail.loading': 'Đang tải chi tiết lĩnh vực...',
      'industryDetail.backToIndustries': 'Quay Lại Danh Sách',
      'industryDetail.services': 'Dịch Vụ Của Chúng Tôi',
      'announcements.title': 'Thông Báo Mới Nhất',
      'announcements.description':
        'Cập nhật tin tức mới nhất, thông cáo báo chí và các cập nhật công ty từ FPT Software.',
      'announcements.loading': 'Đang tải thông báo...',
      'announcements.priority.high': 'Ưu Tiên Cao',
      'announcements.priority.medium': 'Ưu Tiên Trung Bình',
      'announcements.priority.low': 'Ưu Tiên Thấp',
      'announcements.minRead': 'phút đọc',
      'announcements.more': 'thêm',
      'announcements.noAnnouncements': 'Hiện tại chưa có thông báo nào.',
      'announcements.retry': 'Thử Lại',
      'announcements.showing': 'Hiển thị',
      'announcements.of': 'trong',
      'announcements.items': 'mục',
    },
  };

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  translate(key: string): string {
    return this.translations[this.currentLanguage]?.[key] || key;
  }
}
