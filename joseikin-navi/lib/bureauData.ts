export type BureauInfo = {
  prefecture: string;
  name: string;
  division: string;
  phone: string;
};

// 出典: 人材開発支援助成金（事業展開等リスキリング支援コース）パンフレット裏表紙
// 令和8年5月14日現在
export const BUREAU_DATA: BureauInfo[] = [
  { prefecture: "北海道", name: "北海道労働局", division: "雇用助成金さっぽろセンター6階", phone: "011-788-9070" },
  { prefecture: "青森", name: "青森労働局", division: "職業対策課", phone: "017-721-2003" },
  { prefecture: "岩手", name: "岩手労働局", division: "職業対策課助成センター", phone: "019-606-3285" },
  { prefecture: "宮城", name: "宮城労働局", division: "職業対策課助成センター", phone: "022-299-8063" },
  { prefecture: "秋田", name: "秋田労働局", division: "訓練課", phone: "018-883-0006" },
  { prefecture: "山形", name: "山形労働局", division: "山形労働局助成金センター", phone: "023-666-3614" },
  { prefecture: "福島", name: "福島労働局", division: "職業対策課", phone: "024-529-5409" },
  { prefecture: "茨城", name: "茨城労働局", division: "助成金事務センター", phone: "029-297-7235" },
  { prefecture: "栃木", name: "栃木労働局", division: "助成金事務センター", phone: "028-614-2263" },
  { prefecture: "群馬", name: "群馬労働局", division: "職業対策課", phone: "027-210-5008" },
  { prefecture: "埼玉", name: "埼玉労働局", division: "職業対策課助成センター", phone: "048-600-6217" },
  { prefecture: "千葉", name: "千葉労働局", division: "職業対策課分室", phone: "043-441-5678" },
  { prefecture: "東京", name: "東京労働局", division: "ハローワーク助成金事務センター", phone: "03-5332-6926" },
  { prefecture: "神奈川", name: "神奈川労働局", division: "神奈川助成金センター", phone: "045-277-8801" },
  { prefecture: "新潟", name: "新潟労働局", division: "職業対策課助成センター", phone: "025-278-7181" },
  { prefecture: "富山", name: "富山労働局", division: "助成金センター", phone: "076-432-9172" },
  { prefecture: "石川", name: "石川労働局", division: "職業対策課", phone: "076-265-4428" },
  { prefecture: "福井", name: "福井労働局", division: "助成金センター", phone: "0776-22-2683" },
  { prefecture: "山梨", name: "山梨労働局", division: "訓練課", phone: "055-225-2861" },
  { prefecture: "長野", name: "長野労働局", division: "訓練課", phone: "026-226-0862" },
  { prefecture: "岐阜", name: "岐阜労働局", division: "助成金センター", phone: "058-263-5650" },
  { prefecture: "静岡", name: "静岡労働局", division: "職業対策課", phone: "054-271-9970" },
  { prefecture: "愛知", name: "愛知労働局", division: "あいち雇用助成室", phone: "052-688-5758" },
  { prefecture: "三重", name: "三重労働局", division: "職業対策課", phone: "059-226-2111" },
  { prefecture: "滋賀", name: "滋賀労働局", division: "職業対策課", phone: "077-526-8251" },
  { prefecture: "京都", name: "京都労働局", division: "助成金センター", phone: "075-241-3269" },
  { prefecture: "大阪", name: "大阪労働局", division: "助成金センター", phone: "06-7669-8900" },
  { prefecture: "兵庫", name: "兵庫労働局", division: "職業対策課（ハローワーク助成金デスク）", phone: "078-221-5440" },
  { prefecture: "奈良", name: "奈良労働局", division: "助成金センター", phone: "0742-35-6336" },
  { prefecture: "和歌山", name: "和歌山労働局", division: "職業対策課", phone: "073-488-1161" },
  { prefecture: "鳥取", name: "鳥取労働局", division: "訓練課", phone: "0857-22-8777" },
  { prefecture: "島根", name: "島根労働局", division: "訓練課", phone: "0852-20-7028" },
  { prefecture: "岡山", name: "岡山労働局", division: "助成金事務室", phone: "086-238-5301" },
  { prefecture: "広島", name: "広島労働局", division: "職業対策課", phone: "082-502-7832" },
  { prefecture: "山口", name: "山口労働局", division: "助成金センター", phone: "083-902-1564" },
  { prefecture: "徳島", name: "徳島労働局", division: "助成金センター", phone: "088-622-8609" },
  { prefecture: "香川", name: "香川労働局", division: "助成金センター", phone: "087-823-0505" },
  { prefecture: "愛媛", name: "愛媛労働局", division: "職業対策課分室（助成金センター）", phone: "089-987-6370" },
  { prefecture: "高知", name: "高知労働局", division: "助成金センター", phone: "088-878-5328" },
  { prefecture: "福岡", name: "福岡労働局", division: "職業対策課 福岡助成金センター", phone: "092-411-4701" },
  { prefecture: "佐賀", name: "佐賀労働局", division: "職業対策課", phone: "0952-32-7173" },
  { prefecture: "長崎", name: "長崎労働局", division: "職業対策課", phone: "095-801-0042" },
  { prefecture: "熊本", name: "熊本労働局", division: "助成金センター", phone: "096-312-0086" },
  { prefecture: "大分", name: "大分労働局", division: "大分助成金センター", phone: "097-535-2100" },
  { prefecture: "宮崎", name: "宮崎労働局", division: "助成金センター（ハローワークプラザ宮崎内）", phone: "0985-62-3125" },
  { prefecture: "鹿児島", name: "鹿児島労働局", division: "職業対策課各種助成金相談・受付コーナー", phone: "099-219-5101" },
  { prefecture: "沖縄", name: "沖縄労働局", division: "沖縄助成金センター", phone: "098-868-1606" },
];

export function getBureauByPrefecture(prefecture: string): BureauInfo | undefined {
  return BUREAU_DATA.find((b) => b.prefecture === prefecture);
}

export const PREFECTURE_LIST = BUREAU_DATA.map((b) => b.prefecture);

export const BUREAU_PREFECTURE_KEY = "joseikin-company-prefecture";
