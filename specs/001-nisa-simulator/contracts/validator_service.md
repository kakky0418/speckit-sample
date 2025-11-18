# Validator Service Contract

**Service**: NisaValidatorService
**Purpose**: ユーザー入力のバリデーションを行うサービスの契約

## Interface

### Method: validateInvestmentPlan

**Description**: InvestmentPlan の各フィールドをバリデーションし、エラーメッセージを返します。

**Input**:
```dart
InvestmentPlan {
  monthlyAmount: double?,  // nullable
  years: int?,             // nullable
  annualRate: double?      // nullable
}
```

**Output**:
```dart
ValidationResult {
  isValid: bool,
  errors: Map<String, String>  // field名 -> エラーメッセージ
}
```

**Validation Rules**:

1. **monthlyAmount**:
   - null の場合: "積立額を入力してください"
   - < 100 の場合: "積立額は100円以上を入力してください"
   - 数値でない場合: "積立額は数値で入力してください"

2. **years**:
   - null の場合: "積立期間を入力してください"
   - < 1 の場合: "積立期間は1年以上を入力してください"
   - > 40 の場合: "積立期間は40年以下を入力してください"
   - 整数でない場合: "積立期間は整数で入力してください"

3. **annualRate**:
   - null の場合: "想定利回りを入力してください"
   - < -10 の場合: "想定利回りは-10%以上を入力してください"
   - > 20 の場合: "想定利回りは20%以下を入力してください"

**Postconditions**:
- isValid == true の場合、errors は空のマップ
- isValid == false の場合、errors には少なくとも1つのエラーがある

---

### Method: validateMonthlyAmount

**Description**: 積立額のみをバリデーションします（リアルタイムバリデーション用）。

**Input**:
```dart
double? monthlyAmount
```

**Output**:
```dart
FieldValidationResult {
  isValid: bool,
  errorMessage: String?
}
```

**Validation Rules**:
- null の場合: "積立額を入力してください"
- < 100 の場合: "積立額は100円以上を入力してください"
- それ以外: エラーなし

---

### Method: validateYears

**Description**: 積立期間のみをバリデーションします（リアルタイムバリデーション用）。

**Input**:
```dart
int? years
```

**Output**:
```dart
FieldValidationResult {
  isValid: bool,
  errorMessage: String?
}
```

**Validation Rules**:
- null の場合: "積立期間を入力してください"
- < 1 の場合: "積立期間は1年以上を入力してください"
- > 40 の場合: "積立期間は40年以下を入力してください"
- それ以外: エラーなし

---

### Method: validateAnnualRate

**Description**: 想定利回りのみをバリデーションします（リアルタイムバリデーション用）。

**Input**:
```dart
double? annualRate
```

**Output**:
```dart
FieldValidationResult {
  isValid: bool,
  errorMessage: String?
}
```

**Validation Rules**:
- null の場合: "想定利回りを入力してください"
- < -10 の場合: "想定利回りは-10%以上を入力してください"
- > 20 の場合: "想定利回りは20%以下を入力してください"
- それ以外: エラーなし

---

### Method: checkNisaLimit

**Description**: 年間投資額が NISA 枠を超過しているかチェックし、警告メッセージを返します。

**Input**:
```dart
double annualInvestment  // 年間投資額（円）
```

**Output**:
```dart
NisaLimitCheckResult {
  isOverLimit: bool,
  utilizationRate: double,      // 0.0 ~ 1.0+
  warningMessage: String?       // 超過時のみ
}
```

**Calculation Logic**:

```dart
const NISA_LIMIT = 1200000.0;
utilizationRate = annualInvestment / NISA_LIMIT;
isOverLimit = (annualInvestment > NISA_LIMIT);

if (isOverLimit) {
  excess = annualInvestment - NISA_LIMIT;
  warningMessage = "年間投資額が NISA 枠を ${excess.toStringAsFixed(0)}円 超過しています";
}
```

**Postconditions**:
- utilizationRate >= 0.0
- isOverLimit == true の場合、warningMessage != null

---

## Usage Example

```dart
// バリデーターのインスタンス化
final validator = NisaValidatorService();

// 積立プランのバリデーション
final plan = InvestmentPlan(
  monthlyAmount: 30000.0,
  years: 20,
  annualRate: 5.0,
);

final validationResult = validator.validateInvestmentPlan(plan);

if (!validationResult.isValid) {
  validationResult.errors.forEach((field, message) {
    print('$field: $message');
  });
}

// リアルタイムバリデーション（入力フィールドごと）
final amountResult = validator.validateMonthlyAmount(50.0);
if (!amountResult.isValid) {
  print(amountResult.errorMessage);  // "積立額は100円以上を入力してください"
}

// NISA 枠チェック
final annualInvestment = 30000.0 * 12;  // 360,000円
final nisaCheck = validator.checkNisaLimit(annualInvestment);
print('NISA 枠活用率: ${(nisaCheck.utilizationRate * 100).toStringAsFixed(1)}%');
// "NISA 枠活用率: 30.0%"
```

---

## Testing Requirements

### Unit Tests

1. **monthlyAmount バリデーション**:
   - null → エラー
   - 99.99 → エラー
   - 100.0 → OK
   - 1000000.0 → OK

2. **years バリデーション**:
   - null → エラー
   - 0 → エラー
   - 1 → OK
   - 40 → OK
   - 41 → エラー

3. **annualRate バリデーション**:
   - null → エラー
   - -10.01 → エラー
   - -10.0 → OK
   - 0.0 → OK
   - 20.0 → OK
   - 20.01 → エラー

4. **NISA 枠チェック**:
   - 年間投資額 600,000円 → 活用率50%, 超過なし
   - 年間投資額 1,200,000円 → 活用率100%, 超過なし
   - 年間投資額 1,440,000円 → 活用率120%, 超過あり（240,000円超過）

5. **複合バリデーション**:
   - すべてのフィールドが有効 → isValid == true, errors が空
   - 1つでも無効 → isValid == false, errors にエラーがある
   - 複数無効 → errors に複数のエラーがある

### Integration Tests

1. **UI連携**:
   - 入力フィールドにエラーが表示されること
   - エラーが解消されたら表示が消えること

2. **リアルタイムバリデーション**:
   - 入力中に即座にバリデーションが実行されること
   - debounce により連続入力時のパフォーマンスが保たれること

---

## UI Feedback Guidelines

### Error Display

1. **視覚的フィードバック**:
   - エラー時: 入力フィールドの枠を赤色に
   - 正常時: 入力フィールドの枠を緑色に
   - 未入力時: デフォルトの灰色

2. **エラーメッセージ表示位置**:
   - 入力フィールドの直下に表示
   - 赤色のテキストで表示
   - アイコン（⚠️）と共に表示

3. **警告メッセージ（NISA枠超過）**:
   - 計算結果エリアに黄色の背景で表示
   - アイコン（⚠️）と共に表示
   - 超過額を明記

### Validation Timing

1. **入力中**:
   - debounce 300ms 後にバリデーション実行
   - ユーザーが入力を止めてから検証

2. **フォーカス離脱時**:
   - 即座にバリデーション実行
   - エラーがあれば表示

3. **計算ボタン押下時**:
   - すべてのフィールドを一括バリデーション
   - エラーがあれば計算を実行せず、エラー表示

---

## Accessibility

1. **スクリーンリーダー対応**:
   - エラーメッセージは aria-live で通知
   - エラーフィールドに aria-invalid 属性を設定

2. **キーボード操作**:
   - Tab キーでフィールド間を移動可能
   - Enter キーで計算実行

3. **色覚障害対応**:
   - 色だけでなくアイコンやテキストでもエラーを示す
   - 赤色と緑色の区別がつかなくても理解できる

---

## Constants

```dart
const double MIN_MONTHLY_AMOUNT = 100.0;
const int MIN_YEARS = 1;
const int MAX_YEARS = 40;
const double MIN_ANNUAL_RATE = -10.0;
const double MAX_ANNUAL_RATE = 20.0;
const double NISA_TSUMITATE_ANNUAL_LIMIT = 1200000.0;
```

---

## Error Messages (Japanese)

```dart
const ERROR_MESSAGES = {
  'monthlyAmount_required': '積立額を入力してください',
  'monthlyAmount_min': '積立額は100円以上を入力してください',
  'monthlyAmount_numeric': '積立額は数値で入力してください',

  'years_required': '積立期間を入力してください',
  'years_min': '積立期間は1年以上を入力してください',
  'years_max': '積立期間は40年以下を入力してください',
  'years_integer': '積立期間は整数で入力してください',

  'annualRate_required': '想定利回りを入力してください',
  'annualRate_min': '想定利回りは-10%以上を入力してください',
  'annualRate_max': '想定利回りは20%以下を入力してください',

  'nisa_over_limit': '年間投資額が NISA 枠を {excess}円 超過しています',
  'nisa_near_limit': '年間投資額が NISA 枠の上限に近づいています（{utilizationRate}%）',
};
```
