// src/utils/getBingWallpaperUrl.ts

/**
 * 计算从指定日期到今天的天数差
 * @param {Date | string} dateInput - Date 对象或日期字符串（格式为 "YYYY-MM-DD" 或 "YYYY MM DD"）
 * @returns {number} 日期偏移量
 */
function calculateDateOffset(dateInput: Date | string): number {
  let targetDate: Date;

  // 如果输入是字符串，则将其转换为 Date 对象
  if (typeof dateInput === "string") {
    const normalizedDateStr = dateInput.replace(/\s+/g, "-"); // 将空格替换为 "-"
    targetDate = new Date(normalizedDateStr);
  } else {
    // 输入是 Date 对象
    targetDate = dateInput;
  }

  const today = new Date();

  // 确保日期格式正确
  if (isNaN(targetDate.getTime())) {
    throw new Error(
      'Invalid date format. Please use a valid Date object or "YYYY-MM-DD" / "YYYY MM DD".',
    );
  }

  // 计算日期差异（天数）
  const timeDiff = today.getTime() - targetDate.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return dayDiff;
}

/**
 * 获取必应壁纸的完整图片 URL
 * @param {Date | string} dateInput - Date 对象或日期字符串（格式为 "YYYY-MM-DD" 或 "YYYY MM DD"）
 * @returns {Promise<string>} 必应壁纸的完整图片 URL
 */
async function getBingWallpaperUrl(dateInput: Date | string): Promise<string> {
  const dateOffset = calculateDateOffset(dateInput);
  const apiUrl = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${dateOffset}&n=1&mkt=en-US`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const baseUrl = "https://www.bing.com";
    const imageUrl = data.images[0].url;
    const fullImageUrl = baseUrl + imageUrl;

    return fullImageUrl;
  } catch (error) {
    throw new Error("Error fetching Bing wallpaper: " + error);
  }
}

export { getBingWallpaperUrl };
