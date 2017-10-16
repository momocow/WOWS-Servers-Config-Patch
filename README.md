# 戰艦世界伺服器新增工具 (WOWS-Servers-Patch)
> 聲明：本程式僅提供**Windows 64位元**之系統執行，其他版本的系統不保證執行的正確性

## 下載
- [點我](https://github.com/momocow/WOWS-Servers-Patch/releases/latest)

## 特色
- 透過Windows開始功能表，自動偵測戰艦世界目錄路徑。  
> 若偵測失敗，可以透過[手動設定戰艦世界目錄路徑](#戰艦世界目錄)。

- 自動修改伺服器設定，新增額外伺服器。
> 預設為新增北美服，可[自行定義欲新增之伺服器設定](#伺服器設定)。

## 自定義設定
### 戰艦世界目錄
- `%APPDATA%\\wows-servers-patch\\wows-root.dat`
- 格式: 純字串  
整個檔案只包含單行字串  
(不包含換行符號`\r\n`及位於頭尾的空白符號)
### 伺服器設定
- `%APPDATA%\\wows-servers-patch\\servers.xml`
- 格式: XML  
最外層需用`<server>`標籤包覆，每個伺服器用`<host>`標籤包覆，`<master>`標籤指定遊戲登入接口位址。  
預設新增北美伺服器的XML如下，請自行上網尋找其他伺服器資訊。
```
<server>
 <host alias="WOWS NA" csis="http://csis.worldoftanks.com/csis/wowssg " realm="na">
    <master addr="login2.worldofwarships.com:20020"/>
    <master addr="login1.worldofwarships.com:20020"/>
  </host>
</server>
```

## 問題回報
透過[Github Issue](https://github.com/momocow/WOWS-Servers-Patch/issues/new)進行回報，如果可以附上[紀錄檔](#紀錄檔)以便我更快速地釐清問題的原因
### 紀錄檔
- `%APPDATA%\\wows-servers-patch\\app.log`  
