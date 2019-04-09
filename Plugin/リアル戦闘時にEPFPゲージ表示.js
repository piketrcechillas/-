/*--------------------------------------------------------------------------
  
　リアル戦闘時にMP(EP)とFPを表示するスクリプト

■概要
　リアル戦闘時、及び戦闘結果予測画面にMP(EP)とFPを表示するようになります

　※o-to氏のMP(EP)&必殺ゲージ追加スクリプトをあらかじめ入れておく必要があります


■カスタマイズ
　１．リアル戦闘時のFPEPゲージの位置を変えたい
　　　　設定の中の
　　　　　　var UIBATTLELAYOUT_FPEP_LEFT__X = 62;
　　　　　　var UIBATTLELAYOUT_FPEP_LEFT__Y = 46;
　　　　　　　を弄ると、左側のFPEPの表示位置が変わります。

　　　　　　var UIBATTLELAYOUT_FPEP_RIGHT_X = 440;
　　　　　　var UIBATTLELAYOUT_FPEP_RIGHT_Y = 46;
　　　　　　　を弄ると、右側のFPEPの表示位置が変わります。


　　　　　　var UIBATTLELAYOUT_FP_OFFSET_X  = 70;
　　　　　　var UIBATTLELAYOUT_FP_OFFSET_Y  = 0;
　　　　　　　を弄ると、EP～FPの描画の間を広げたり縮めたり出来ます。

　２．戦闘結果予測画面のFPEPゲージの位置を変えたい
　　　　設定の中の
　　　　　　var POSATTACK_FPEP_X            = 136;
　　　　　　var POSATTACK_FPEP_Y            = -16;
　　　　　　　を弄ると、FPEPの表示位置が変わります。

　　　　　　var POSATTACK_FP_OFFSET_X          = 0;
　　　　　　var POSATTACK_FP_OFFSET_Y       = 14;
　　　　　　　を弄ると、EP～FPの描画の間を広げたり縮めたり出来ます。

　３．簡易戦闘画面のFPEPゲージの位置を変えたい
　　　　設定の中の
　　　　　　var POSATTACK_FPEP_X            = 136;
　　　　　　var POSATTACK_FPEP_Y            = -16;
　　　　　　　を弄ると、FPEPの表示位置が変わります。

　　　　　　var POSATTACK_FP_OFFSET_X          = 0;
　　　　　　var POSATTACK_FP_OFFSET_Y       = 14;
　　　　　　　を弄ると、EP～FPの描画の間を広げたり縮めたり出来ます。

　４．FPEPゲージを詳細表示にしたい
　　　※FP、EPどちらか片方しか使わない場合のみ可能です（情報量が増える為、両方は表示出来ません）
　　　　設定の中の
　　　　　「var EPFP_GAUGE_SIMPLE           = true;」のtrueをfalseに変えるとゲージを詳細表示します。

　５．FPEPゲージ詳細表示時、リアル戦闘時のFPEPウィンドウの位置を変えたい
　　　　設定の中の
　　　　　　var UIBATTLELAYOUT_WINDOW_LEFT__X = 16;
　　　　　　var UIBATTLELAYOUT_WINDOW_LEFT__Y = 0;
　　　　　　　を弄ると、左側のFPEPウィンドウの表示位置が変わります。

　　　　　　var UIBATTLELAYOUT_WINDOW_RIGHT_X = 434;
　　　　　　var UIBATTLELAYOUT_WINDOW_RIGHT_Y = 0;
　　　　　　　を弄ると、右側のFPEPウィンドウの表示位置が変わります。

　　　　　　var UIBATTLELAYOUT_WINDOW_OFFSET_X = 0;
　　　　　　var UIBATTLELAYOUT_WINDOW_OFFSET_Y = 16;
　　　　　　　を弄ると、EP～FPの描画の間を広げたり縮めたり出来ます。

　６．FPEPゲージ詳細表示時、戦闘結果予測画面のFPEPウィンドウの位置を変えたい
　　　　設定の中の
　　　　　　var POSATTACK_WINDOW_X             = -16;
　　　　　　var POSATTACK_WINDOW_Y             = -56;
　　　　　　　を弄ると、FPEPウィンドウの表示位置が変わります。

　　　　　　var POSATTACK_WINDOW_OFFSET_X      = 0;
　　　　　　var POSATTACK_WINDOW_OFFSET_Y      = 16;
　　　　　　　を弄ると、EP～FPの描画の間を広げたり縮めたり出来ます。

　７．FPEPゲージ詳細表示時、簡易戦闘画面のFPEPウィンドウの位置を変えたい
　　　　設定の中の
　　　　　　var EASYATTACK_WINDOW_X            = -16;
　　　　　　var EASYATTACK_WINDOW_Y            = -56;
　　　　　　　を弄ると、FPEPの表示位置が変わります。

　　　　　　var EASYATTACK_WINDOW_OFFSET_X     = 0;
　　　　　　var EASYATTACK_WINDOW_OFFSET_Y     = 16;
　　　　　　　を弄ると、EP～FPの描画の間を広げたり縮めたり出来ます。


修正内容
16/11/18 ：新規作成
16/11/22 ：ゲージを細かく表示する設定追加（EPかFPどちらか一つだけ表示している場合でないとちゃんと表示出来ません）
　　　　　 簡易戦闘画面にもゲージを追加
16/11/22b：ゲージを細かく表示する設定をEPFP両方で表示できるように修正
16/11/23 ：攻撃時にEPFPを消費しているようにゲージと数値の表示を更新した（見た目だけ。残EPFP値の更新処理は行っていない）
16/11/23b：MoveCostによるEPFPの減少をゲージに反映するよう修正
18/08/14 ：コマンド_二刀流.jsとの併用に対応
18/08/14b リアル戦闘時にEPFPゲージ表示.jsとの併用に対応(詳細設定時)


■対応バージョン
　SRPG Studio Version:1.192

■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。どんどん改造してください。
・クレジット明記無し　OK
・再配布、転載　OK
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。

■著作表記
本スクリプトはo-to氏のMP(EP)&必殺ゲージ追加スクリプトを弄って改変したものです。
著作権はo-to氏に存在します。

■改変者
名前未定（仮）

--------------------------------------------------------------------------*/

//-----------------------------
// 設定(外部)
//-----------------------------

// ゲージ簡易表示
var EPFP_GAUGE_SIMPLE              = true;		// (true:簡易表示　false:詳細表示)


//--------
// 戦闘結果予測（簡易）
//--------
// FPEPゲージの描画開始座標
var POSATTACK_FPEP_X               = 136;
var POSATTACK_FPEP_Y               = -16;

// EPゲージ描画後、FPゲージを描画する際のオフセット座標
var POSATTACK_FP_OFFSET_X          = 0;
var POSATTACK_FP_OFFSET_Y          = 14;

//--------
// 戦闘結果予測（詳細）
//--------
// FPEPゲージの描画開始座標
var POSATTACK_WINDOW_X             = -16;
var POSATTACK_WINDOW_Y             = -56;

// EPゲージ描画後、FPゲージを描画する際のオフセット座標
var POSATTACK_WINDOW_OFFSET_X      = 0;
var POSATTACK_WINDOW_OFFSET_Y      = 16;

// キャッシュ用のデータ
var OT_Image_AddStatusSimpleWindow2  = null;




(function() {

//-----------------------------
// 設定
//-----------------------------


//--------
// リアル戦闘（簡易）
//--------
// 左側のFPEPゲージの描画開始座標
var UIBATTLELAYOUT_FPEP_LEFT__X    = 62;
var UIBATTLELAYOUT_FPEP_LEFT__Y    = 46;

// 右側のFPEPゲージの描画開始座標
var UIBATTLELAYOUT_FPEP_RIGHT_X    = 440;
var UIBATTLELAYOUT_FPEP_RIGHT_Y    = 46;

// EPゲージ描画後、FPゲージを描画する際のオフセット座標
var UIBATTLELAYOUT_FP_OFFSET_X     = 70;
var UIBATTLELAYOUT_FP_OFFSET_Y     = 0;

//--------
// リアル戦闘（詳細）
//--------
// 左側のFPEPゲージの描画開始座標
var UIBATTLELAYOUT_WINDOW_LEFT__X  = 16;
var UIBATTLELAYOUT_WINDOW_LEFT__Y  = 0;

// 右側のFPEPゲージの描画開始座標
var UIBATTLELAYOUT_WINDOW_RIGHT_X  = 434;
var UIBATTLELAYOUT_WINDOW_RIGHT_Y  = 0;

// EPゲージ描画後、FPゲージを描画する際のオフセット座標
var UIBATTLELAYOUT_WINDOW_OFFSET_X = 0;
var UIBATTLELAYOUT_WINDOW_OFFSET_Y = 16;

//--------
// 簡易戦闘（簡易）
//--------
// FPEPゲージの描画開始座標
var EASYATTACK_FPEP_X              = 0;
var EASYATTACK_FPEP_Y              = -16;

// ：EPゲージ描画後、FPゲージを描画する際のオフセット座標
var EASYATTACK_FP_OFFSET_X         = 70;
var EASYATTACK_FP_OFFSET_Y         = 0;

//--------
// 簡易戦闘（詳細）
//--------
// FPEPゲージの描画開始座標
var EASYATTACK_WINDOW_X            = -16;
var EASYATTACK_WINDOW_Y            = -56;

// ：EPゲージ描画後、FPゲージを描画する際のオフセット座標
var EASYATTACK_WINDOW_OFFSET_X     = 0;
var EASYATTACK_WINDOW_OFFSET_Y     = 16;




/////// 以下は内部で使ってる設定です。プログラムが判らない人は触らないでください /////// 
// マップ内でのフレーム素材の宣言
OT_SimpleFrameSetting2 = {
	  Material        : 'OT_AddStatus'
	, WindowImg       : 'window2.png'
	, WindowWidth     : 190
	, WindowHeight    : 40
	, GaugeImg        : 'Gauge2.png'
	, GaugeImgSimpleX : 12
	, GaugeImgSimpleY : 5
	, GaugeImgX1      : 126
	, GaugeImgY1      : 5
	, GaugeImgX2      : 12
	, GaugeImgY2      : 16
	, GaugeImgWidth   : 60
	, GaugeImgEpID    : 1
	, GaugeImgFpID    : 2
	, FontColorEp     : 0x00ffff
	, FontColorFp     : 0xffa000
};

// キャッシュ用のデータ
var OT_Image_AddStatusSimpleGauge2   = null;




// 武器の使用EPを取得
OT_GetWeaponUseEPValue = function(unit) {
		var value;
		var weapon = BattlerChecker.getRealBattleWeapon(unit);

		if(typeof UnitParameter.MEP !== 'undefined')
		{
			if( OT_isEPCustom(weapon) ) {
				value = OT_GetEPValue( weapon.custom.OT_EP.Use, ParamBonus.getEp(unit) );
				return value;
			}
		}
		
		return 0;
}


// 武器の使用FPを取得
OT_GetWeaponUseFPValue = function(unit) {
		var weapon = BattlerChecker.getRealBattleWeapon(unit);

		if(typeof UnitParameter.MFP !== 'undefined')
		{
			if( OT_isFPCustom(weapon) ) {
				return OT_GetFPValue( weapon.custom.OT_FP.Use, ParamBonus.getFp(unit) );
			}
		}
		
		return 0;
}




// 移動時の使用EPを取得
OT_GetMoveUseEPValue = function(unit) {
		var objClass = unit.getClass();

		if(typeof UnitParameter.MEP !== 'undefined')
		{
			if( OT_isEPCustom(objClass) ) {
				if( typeof unit.custom.tmpMoveEP === 'number' )
				{
					return unit.custom.tmpMoveEP;
				}
			}
		}
		
		return 0;
}


// 移動時の使用FPを取得
OT_GetMoveUseFPValue = function(unit) {
		var objClass = unit.getClass();

		if(typeof UnitParameter.MFP !== 'undefined')
		{
			if( OT_isFPCustom(objClass) ) {
				if( typeof unit.custom.tmpMoveFP === 'number' )
				{
					return unit.custom.tmpMoveFP;
				}
			}
		}
		
		return 0;
}




//------------------------------------------------------
// SetupControl
//------------------------------------------------------
// ゲーム開始時に画像データを保持しておく
var aliasSetup = SetupControl.setup
SetupControl.setup = function()
{
	aliasSetup.call(this);
	if(OT_Image_AddStatusSimpleWindow2== null)    OT_Image_AddStatusSimpleWindow2   = root.getMaterialManager().createImage(OT_SimpleFrameSetting2.Material, OT_SimpleFrameSetting2.WindowImg);
	if(OT_Image_AddStatusSimpleGauge2 == null)    OT_Image_AddStatusSimpleGauge2    = root.getMaterialManager().createImage(OT_SimpleFrameSetting2.Material, OT_SimpleFrameSetting2.GaugeImg);
};




//------------------------------------------------------
// UIBattleLayout
//------------------------------------------------------
// リアル戦闘の描画処理にFPEP描画を追加
var alias100 = UIBattleLayout._drawMain;
UIBattleLayout._drawMain= function() {
		alias100.call(this);

		var x1 = UIBATTLELAYOUT_FPEP_RIGHT_X;
		var y1 = UIBATTLELAYOUT_FPEP_RIGHT_Y;
		var x2 = UIBATTLELAYOUT_FPEP_LEFT__X;
		var y2 = UIBATTLELAYOUT_FPEP_LEFT__Y;
		var offset_x = UIBATTLELAYOUT_FP_OFFSET_X;
		var offset_y = UIBATTLELAYOUT_FP_OFFSET_Y;

		// 詳細表示の場合ウィンドウ枠を描画、また、その上にゲージを表示するようにXY座標を変更
		if( EPFP_GAUGE_SIMPLE == false ) {
			var window_x1 = UIBATTLELAYOUT_WINDOW_RIGHT_X;
			var window_y1 = UIBATTLELAYOUT_WINDOW_RIGHT_Y;
			var window_x2 = UIBATTLELAYOUT_WINDOW_LEFT__X;
			var window_y2 = UIBATTLELAYOUT_WINDOW_LEFT__Y;
			x1 = window_x1 + 4;
			y1 = window_y1;
			x2 = window_x2 + 4;
			y2 = window_y2;
			offset_x = UIBATTLELAYOUT_WINDOW_OFFSET_X;
			offset_y = UIBATTLELAYOUT_WINDOW_OFFSET_Y;

			var width  = OT_SimpleFrameSetting2.WindowWidth;
			var height = OT_SimpleFrameSetting2.WindowHeight;
			WindowRenderer.drawStretchWindow(window_x1, window_y1, width, height, OT_Image_AddStatusSimpleWindow2);
			WindowRenderer.drawStretchWindow(window_x2, window_y2, width, height, OT_Image_AddStatusSimpleWindow2);
		}

		// ゲージの描画
		this._drawFpEp(x1, y1, this._battlerRight.getUnit(), offset_x, offset_y, this._RightTmpEp, this._RightTmpFp);
		this._drawFpEp(x2, y2, this._battlerLeft.getUnit(),  offset_x, offset_y, this._LeftTmpEp, this._LeftTmpFp);
}


// リアル戦闘でFPEPゲージを描画
UIBattleLayout._drawFpEp = function(x, y, unit, offset_x, offset_y, tmpep, tmpfp)
{
	if(typeof UnitParameter.MEP !== 'undefined')
	{
		ContentRenderer.drawUnitEpZoneHorizonal(x, y, unit, OT_Image_AddStatusSimpleGauge2, tmpep);
		x += offset_x;
		y += offset_y;
	}
	if(typeof UnitParameter.MFP !== 'undefined')
	{
		ContentRenderer.drawUnitFpZoneHorizonal(x, y, unit, OT_Image_AddStatusSimpleGauge2, tmpfp);
	}
};


var alias101 = UIBattleLayout.setBattlerAndParent;
UIBattleLayout.setBattlerAndParent= function (battlerRight, battlerLeft, realBattle) {
		alias101.call(this, battlerRight, battlerLeft, realBattle);

		this._RightTmpEp = OT_GetMoveUseEPValue(this._battlerRight.getUnit());
		this._RightTmpFp = OT_GetMoveUseFPValue(this._battlerRight.getUnit());
		this._LeftTmpEp = OT_GetMoveUseEPValue(this._battlerLeft.getUnit());
		this._LeftTmpFp = OT_GetMoveUseFPValue(this._battlerLeft.getUnit());
}


var alias102 = UIBattleLayout.setDamage;
UIBattleLayout.setDamage= function(battler, damage, isCritical, isFinish) {
		alias102.call(this, battler, damage, isCritical, isFinish);

		var unit;

		if (battler === this._battlerRight) {
			unit   = this._battlerLeft.getUnit();

			this._LeftTmpEp += OT_GetWeaponUseEPValue(unit);
			this._LeftTmpFp += OT_GetWeaponUseFPValue(unit);
		}
		else {
			unit   = this._battlerRight.getUnit();

			this._RightTmpEp += OT_GetWeaponUseEPValue(unit);
			this._RightTmpFp += OT_GetWeaponUseFPValue(unit);
		}
}


var alias103 = UIBattleLayout.showAvoidAnime;
UIBattleLayout.showAvoidAnime= function(battler) {
		alias103.call(this, battler);

		var unit;

		if (battler === this._battlerRight) {
			unit = this._battlerLeft.getUnit();

			this._LeftTmpEp += OT_GetWeaponUseEPValue(unit);
			this._LeftTmpFp += OT_GetWeaponUseFPValue(unit);
		}
		else {
			unit = this._battlerRight.getUnit();

			this._RightTmpEp += OT_GetWeaponUseEPValue(unit);
			this._RightTmpFp += OT_GetWeaponUseFPValue(unit);
		}
}




//------------------------------------------------------
// PosAttackWindow
//------------------------------------------------------
// 戦闘結果予測画面の描画処理にFPEP描画を追加
var alias200 = PosAttackWindow.drawInfo;
PosAttackWindow.drawInfo= function(xBase, yBase) {
		alias200.call(this, xBase, yBase);

		var xx = xBase+POSATTACK_FPEP_X;
		var yy = yBase+POSATTACK_FPEP_Y;
		var offset_x = POSATTACK_FP_OFFSET_X;
		var offset_y = POSATTACK_FP_OFFSET_Y;

		// 詳細表示の場合ウィンドウ枠を描画、また、その上にゲージを表示するようにXY座標を変更
		if( EPFP_GAUGE_SIMPLE == false ) {
			var window_x = xBase+POSATTACK_WINDOW_X;
			var window_y = yBase+POSATTACK_WINDOW_Y;
			xx = window_x + 4;
			yy = window_y;
			offset_x = POSATTACK_WINDOW_OFFSET_X;
			offset_y = POSATTACK_WINDOW_OFFSET_Y;

			var width  = this.getWindowWidth();
			var height = OT_SimpleFrameSetting2.WindowHeight;
			WindowRenderer.drawStretchWindow(window_x, window_y, width, height, OT_Image_AddStatusSimpleWindow2);
		}

		this._drawFpEp(xx, yy, this._unit, offset_x, offset_y);
}


// 戦闘結果予測画面でFPEPゲージを描画
PosAttackWindow._drawFpEp = function(x, y, unit, offset_x, offset_y)
{
	if(typeof UnitParameter.MEP !== 'undefined')
	{
		if( EPFP_GAUGE_SIMPLE == false ) {
			ContentRenderer.drawUnitEpZoneHorizonal(x, y, unit, OT_Image_AddStatusSimpleGauge2, OT_GetMoveUseEPValue(unit));
		}
		else {
			ContentRenderer.drawUnitEpZoneVirtical(x, y, unit, OT_Image_AddStatusSimpleGauge2, OT_GetMoveUseEPValue(unit));
		}
		x += offset_x;
		y += offset_y;
	}
	if(typeof UnitParameter.MFP !== 'undefined')
	{
		if( EPFP_GAUGE_SIMPLE == false ) {
			ContentRenderer.drawUnitFpZoneHorizonal(x, y, unit, OT_Image_AddStatusSimpleGauge2, OT_GetMoveUseFPValue(unit));
		}
		else {
			ContentRenderer.drawUnitFpZoneVirtical(x, y, unit, OT_Image_AddStatusSimpleGauge2, OT_GetMoveUseFPValue(unit));
		}
	}
};




//------------------------------------------------------
// EasyAttackWindow
//------------------------------------------------------
var alias300 = EasyAttackWindow.setEasyAttackUnit;
EasyAttackWindow.setEasyAttackUnit= function(unit) {
		alias300.call(this, unit);

		this._TmpEp = OT_GetMoveUseEPValue(unit);
		this._TmpFp = OT_GetMoveUseFPValue(unit);
}


// 簡易戦闘画面にFPEP描画を追加
var alias301 = EasyAttackWindow.drawWindowContent;
EasyAttackWindow.drawWindowContent= function(x, y) {
		alias301.call(this, x, y);

		var xx = x+EASYATTACK_FPEP_X;
		var yy = y+EASYATTACK_FPEP_Y;
		var offset_x = EASYATTACK_FP_OFFSET_X;
		var offset_y = EASYATTACK_FP_OFFSET_Y;

		// 詳細表示の場合ウィンドウ枠を描画、また、その上にゲージを表示するようにXY座標を変更
		if( EPFP_GAUGE_SIMPLE == false ) {
			var window_x = x+EASYATTACK_WINDOW_X;
			var window_y = y+EASYATTACK_WINDOW_Y;
			xx = window_x + 4;
			yy = window_y;
			offset_x = EASYATTACK_WINDOW_OFFSET_X;
			offset_y = EASYATTACK_WINDOW_OFFSET_Y;

			var width  = this.getWindowWidth();
			var height = OT_SimpleFrameSetting2.WindowHeight;
			WindowRenderer.drawStretchWindow(window_x, window_y, width, height, OT_Image_AddStatusSimpleWindow2);
		}

		this._drawFpEp(xx, yy, this._unit, offset_x, offset_y);
}


// 簡易戦闘画面でFPEPゲージを描画
EasyAttackWindow._drawFpEp = function(x, y, unit, offset_x, offset_y)
{
	if(typeof UnitParameter.MEP !== 'undefined')
	{
		ContentRenderer.drawUnitEpZoneHorizonal(x, y, unit, OT_Image_AddStatusSimpleGauge2, this._TmpEp);
		x += offset_x;
		y += offset_y;
	}
	if(typeof UnitParameter.MFP !== 'undefined')
	{
		ContentRenderer.drawUnitFpZoneHorizonal(x, y, unit, OT_Image_AddStatusSimpleGauge2, this._TmpFp);
	}
};




//------------------------------------------------------
// EasyBattle
//------------------------------------------------------
// 簡易戦闘での攻守切替（※EasyAttackWindowではFPEPが取得できないので、上位クラスで取得してEasyAttackWindowにセットしている）
var alias400 = EasyBattle._changeBattle;
EasyBattle._changeBattle= function() {
		alias400.call(this);

		var order = this._order;
		var unit;

		if (this._battlerRight.getUnit() === order.getActiveUnit()) {
			unit = this._battlerRight.getUnit();

			this._easyMenu._leftWindow._TmpEp += OT_GetWeaponUseEPValue(unit);
			this._easyMenu._leftWindow._TmpFp += OT_GetWeaponUseFPValue(unit);
		}
		else {
			unit = this._battlerLeft.getUnit();

			this._easyMenu._rightWindow._TmpEp += OT_GetWeaponUseEPValue(unit);
			this._easyMenu._rightWindow._TmpFp += OT_GetWeaponUseFPValue(unit);
		}
}




//------------------------------------------------------
// ContentRenderer
//------------------------------------------------------
// EPゲージ描写(リアル戦闘用。横に並べる)
ContentRenderer.drawUnitEpZoneHorizonal = function(x, y, unit, pic, tmpep) {
	var ep = OT_GetNowEP(unit) - tmpep;
	if( ep < 0 ) { ep = 0; }
	var mep = ParamBonus.getEp(unit);
	var rep = OT_GetEPRecoveryAll(unit);

	var dx = [];
	if( EPFP_GAUGE_SIMPLE == false ) {
//		dx = [0, 44, 60, 98, 106];
		dx = [0, 40, 50, 84, 90];
	}
	else {
		dx = [0, 26, 34, 50, 60];
	}
	var dy = [1,  0,  1,  0,  1];

	if( EPFP_GAUGE_SIMPLE == true ) {
		this.drawEpSimpleType(x, y, ep, mep);
		x += OT_SimpleFrameSetting2.GaugeImgSimpleX;
		y += OT_SimpleFrameSetting2.GaugeImgSimpleY;
		this.drawGauge(x, y, ep, mep, OT_SimpleFrameSetting2.GaugeImgEpID, OT_SimpleFrameSetting2.GaugeImgWidth, pic);
	}
	else {
		this.drawEpDetailType(x, y, ep, mep, rep, dx, dy);
		x += OT_SimpleFrameSetting2.GaugeImgX1;
		y += OT_SimpleFrameSetting2.GaugeImgY1;
		this.drawGauge(x, y, ep, mep, OT_SimpleFrameSetting2.GaugeImgEpID, OT_SimpleFrameSetting2.GaugeImgWidth, pic);
	}
};


// EPゲージ描写(戦闘結果予測画面用。縦に並べる)
ContentRenderer.drawUnitEpZoneVirtical = function(x, y, unit, pic, tmpep) {
	var ep = OT_GetNowEP(unit) - tmpep;
	if( ep < 0 ) { ep = 0; }
	var mep = ParamBonus.getEp(unit);
	var rep = OT_GetEPRecoveryAll(unit);
	var dx = [-16, 10, 18, 34, 44];
	var dy = [ -2, -2, -2, -2, -1];

	if( EPFP_GAUGE_SIMPLE == true ) {
		this.drawEpSimpleType(x, y, ep, mep);
		x += OT_SimpleFrameSetting2.GaugeImgSimpleX;
		y += OT_SimpleFrameSetting2.GaugeImgSimpleY;
		this.drawGauge(x, y, ep, mep, OT_SimpleFrameSetting2.GaugeImgEpID, OT_SimpleFrameSetting2.GaugeImgWidth, pic);
	}
	else {
		this.drawEpDetailType(x, y, ep, mep, rep, dx, dy);
		x += OT_SimpleFrameSetting2.GaugeImgX2;
		y += OT_SimpleFrameSetting2.GaugeImgY2;
		this.drawGauge(x, y, ep, mep, OT_SimpleFrameSetting2.GaugeImgEpID, OT_SimpleFrameSetting2.GaugeImgWidth, pic);
	}
};


// EP数値描写(シンプル版)
ContentRenderer.drawEpSimpleType = function(x, y, ep, maxEp) {
	var textEp = UnitParameter.MEP.getParameterName();
	var dx = [0, 34];
	
	TextRenderer.drawSignText(x + dx[0], y+1, textEp);
//	NumberRenderer.drawNumber(x + dx[1], y, ep);
};


// EP数値描写(詳細版)
ContentRenderer.drawEpDetailType = function(x, y, ep, maxEp, RecoveryEp, dx, dy) {
	var textEp = UnitParameter.MEP.getParameterName();
	var textSlash = '/';
	var textRecovery = '(' + RecoveryEp + ')';
	var textui = InfoWindow.getWindowTextUI();
	var color = textui.getColor();
	var font = textui.getFont();
	
	TextRenderer.drawSignText(x + dx[0], y + dy[0], textEp);
	NumberRenderer.drawNumber(x + dx[1], y + dy[1], ep);
	TextRenderer.drawSignText(x + dx[2], y + dy[2], textSlash);
	NumberRenderer.drawNumber(x + dx[3], y + dy[3], maxEp);
	TextRenderer.drawKeywordText(x + dx[4], y + dy[4], textRecovery, -1, OT_SimpleFrameSetting2.FontColorEp, font);
};


// FPゲージ描写(リアル戦闘用。横に並べる)
ContentRenderer.drawUnitFpZoneHorizonal = function(x, y, unit, pic, tmpfp) {
	var fp = OT_GetNowFP(unit) - tmpfp;
	if( fp < 0 ) { fp = 0; }
	var mfp = ParamBonus.getFp(unit);
	var rfp = OT_GetFPRecoveryAll(unit);
	var dx = [];
	if( EPFP_GAUGE_SIMPLE == false ) {
//		dx = [0, 44, 60, 98, 106];
		dx = [0, 40, 50, 84, 90];
	}
	else {
		dx = [0, 26, 34, 50, 60];
	}
	var dy = [1,  0,  1,  0,  0];
	
	if( EPFP_GAUGE_SIMPLE == true ) {
		this.drawFpSimpleType(x, y, fp, mfp);
		x += OT_SimpleFrameSetting2.GaugeImgSimpleX;
		y += OT_SimpleFrameSetting2.GaugeImgSimpleY;
		this.drawGauge(x, y, fp, mfp, OT_SimpleFrameSetting2.GaugeImgFpID, OT_SimpleFrameSetting2.GaugeImgWidth, pic);
	}
	else {
		this.drawFpDetailType(x, y, fp, mfp, rfp, dx, dy);
		x += OT_SimpleFrameSetting2.GaugeImgX1;
		y += OT_SimpleFrameSetting2.GaugeImgY1;
		this.drawGauge(x, y, fp, mfp, OT_SimpleFrameSetting2.GaugeImgFpID, OT_SimpleFrameSetting2.GaugeImgWidth, pic);
	}
};


// FPゲージ描写(戦闘結果予測画面用。縦に並べる)
ContentRenderer.drawUnitFpZoneVirtical = function(x, y, unit, pic, tmpfp) {
	var fp = OT_GetNowFP(unit) - tmpfp;
	if( fp < 0 ) { fp = 0; }
	var mfp = ParamBonus.getFp(unit);
	var rfp = OT_GetFPRecoveryAll(unit);
	var dx = [-16, 10, 18, 34, 44];
	var dy = [ -2, -2, -2, -2, -1];
	
	if( EPFP_GAUGE_SIMPLE == true ) {
		this.drawFpSimpleType(x, y, fp, mfp);
		x += OT_SimpleFrameSetting2.GaugeImgSimpleX;
		y += OT_SimpleFrameSetting2.GaugeImgSimpleY;
		this.drawGauge(x, y, fp, mfp, OT_SimpleFrameSetting2.GaugeImgFpID, OT_SimpleFrameSetting2.GaugeImgWidth, pic);
	}
	else {
		this.drawFpDetailType(x, y, fp, mfp, rfp, dx, dy);
		x += OT_SimpleFrameSetting2.GaugeImgX2;
		y += OT_SimpleFrameSetting2.GaugeImgY2;
		this.drawGauge(x, y, fp, mfp, OT_SimpleFrameSetting2.GaugeImgFpID, OT_SimpleFrameSetting2.GaugeImgWidth, pic);
	}
};


// FP数値描写(シンプル版)
ContentRenderer.drawFpSimpleType = function(x, y, fp, maxFp) {
	var textFp = UnitParameter.MFP.getParameterName();
	var dx = [0, 34];

	TextRenderer.drawSignText(x + dx[0], y+1, textFp);
//	NumberRenderer.drawNumber(x + dx[1], y, fp);
};


// FP数値描写(詳細版)
ContentRenderer.drawFpDetailType = function(x, y, fp, maxFp, RecoveryFp, dx, dy) {
	var textFp = UnitParameter.MFP.getParameterName();
	var textSlash = '/';
	var textRecovery = '(' + RecoveryFp + ')';
	var textui = InfoWindow.getWindowTextUI();
	var color = textui.getColor();
	var font = textui.getFont();
	
	TextRenderer.drawSignText(x + dx[0], y + dy[0], textFp);
	NumberRenderer.drawNumber(x + dx[1], y + dy[1], fp);
	TextRenderer.drawSignText(x + dx[2], y + dy[2], textSlash);
	NumberRenderer.drawNumber(x + dx[3], y + dy[3], maxFp);
	TextRenderer.drawKeywordText(x + dx[4], y + dy[4], textRecovery, -1, OT_SimpleFrameSetting2.FontColorFp, font);
};


})();