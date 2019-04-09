
/*--------------------------------------------------------------------------
  
　リアル戦闘HPバー変更

■概要
　リアル戦闘時のHPバーを変更します
　HPバーは%で表示され、戦闘開始時の現在HPが青色、戦闘中に受けたダメージが赤色で表示されます
　（現在HPが最大HPの50%の場合、HPバーの半分が青、半分が黒の状態で戦闘が開始され、受けたダメージの分が赤色で表示されます）
　また、武器オプションのHP吸収で回復するHPは緑色で表示されます

■事前準備
　本スクリプトをpluginフォルダに入れます
　その上でMaterialフォルダに「$HpBarChangeEx」のフォルダを移動させ、フォルダ名を「HpBarChangeEx」に変えて下さい

　HpBarChangeExのフォルダにはゲージ.pngとゲージb.pngの2種類のバーが用意されています
　通常はゲージ.pngが使われますが、設定にある「hpBarImg : 'ゲージ.png'」を「hpBarImg : 'ゲージb.png'」に変えればゲージb.pngを使用できます

■カスタマイズ
　１．赤色でダメージ部分を描画するのをやめたい
　　　→「var isHPDmgDisplay = true;」のtrueをfalseに変えて下さい
　２．HPバーを表示する座標を変えたい
　　　→「var HPBarHoseiX = 0;」の0を違う数値に変える事でバーのX座標を
　　　　「var HPBarHoseiY = 0;」の0を違う数値に変える事でバーのY座標を変える事が出来ます
　　　　　※基点からの相対座標を変えるだけなので、敵側と自軍側のHPバーの位置をばらばらにずらす事は出来ません
　３．ダメージを受けた場合のHP減少コマ数を変えたい
　　　→「var HPDmgDispKoma = 20;」の20を変えて下さい
　　　　　※コマ数は偶数、かつ0以上の数にしないと正常に動作しない場合があります
　４．HPバーに使う画像ファイルの名前を変えたい
　　　→「hpBarImg : 'ゲージ.png'」のゲージ.pngの部分を、使いたい画像ファイル名に変えて下さい
　５．敵側のHPバーを反転表示したい
　　　→「var isLeftBarRev = false;」のfalseをtrueに変えて下さい
　６．緑色で回復部分を描画するのをやめたい
　　　→「var isHPHealDisplay= true;」のtrueをfalseに変えて下さい

■HPバー用画像の基本仕様
　画像幅は140ドット（HPBarPicWidth）
　左端10ドットが左側枠（HPBarPicWakuL）、右端10ドットが右側枠（HPBarPicWakuR）、中央120ドットがHPバー部分になっています

　HPバーの画像高さは14ドット（HPBarPicHetght）
　HPバーは一番上から、地の部分（HPBarBGID）、現在HPの部分（HPBarHPID）、回復部分（2番目）、ダメージ部分（HPBarDMID）の4本となっています

　これら設定した値を変える事で、画像の大きさを変える事も出来ます
　例）HPBarPicHetghtの値を28とし、HPバーの画像高さを28ドットで4本描いたゲージ.pngを用意すれば
　　　高さ28ドットのHPバーを描画する事も出来ます

■備考
　ダメージの値が1.5など小数点つきの値になった場合もエラー落ちしなくなりました
　デバッグ用コンソールに警告が出るようにしてありますので、テスト時はコンソールの表示をONにしておいて下さい


17/08/22  新規作成
17/08/23  敵側のHPバーを反転表示する設定を追加
17/08/23b HP吸収などで回復するHPを表示する設定を追加
18/01/19  ダメージ計算式を変更するプラグインによりダメージが小数点付きの値になった場合、エラー落ちするのを修正
          警告をコンソールに出すようにした


■対応バージョン
　SRPG Studio Version:1.171


■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。どんどん改造してください。
・クレジット明記無し　OK
・再配布、転載　OK
・SRPG Studio利用規約は遵守してください。
  
--------------------------------------------------------------------------*/


(function() {
//-------------------------------------------------------
// 設定
//-------------------------------------------------------
var isHPDmgDisplay = true;	// ダメージ部分を描画するか（true:描画 false:描画しない）
var isHPHealDisplay= true;	// 回復を描画するか（true:描画 false:描画しない）
var isLeftBarRev   = true;	// 敵側のHPゲージを反転するか（true:反転する false:反転しない）

var HPBarHoseiX    = 0;		// HPバーX座標補正
var HPBarHoseiY    = 0;		// HPバーY座標補正

var HPDmgDispKoma  = 20;	// ダメージを受けた場合、HP減少を何コマで描画するか（デフォルトは20コマ）

var HPBarPicWidth  = 140;	// HPバー画像の幅
var HPBarPicWakuL  = 10;	// HPバー画像左枠のサイズ
var HPBarPicWakuR  = 10;	// HPバー画像右枠のサイズ
var HPBarPicHetght = 14;	// HPバー画像の高さ
var HPBarBGID      = 0;		// 地の部分（デフォルトは上から0番目）
var HPBarDMID      = 3;		// ダメージ部分（デフォルトは上から3番目）
var HPBarHPID      = 1;		// 現在HPの部分（デフォルトは上から1番目）
var HPBarHEALID    = 2;		// 回復したHPの部分（デフォルトは上から2番目）


// HPバー描画用の定義(Materialフォルダ用)
HPBar_SETTING = {
	  Folder        : 'HpBarChangeEx'				// Materialフォルダ内に作ったフォルダ名
	, hpBarImg      : 'ゲージ.png'					// HPバーの画像ファイル名
};





//-------------------------------------------------------
// 以下、プログラム
//-------------------------------------------------------
var hpBarPic = null;		// HPバー画像格納領域


//-----------------------------
// GaugeBarForHPクラス
//-----------------------------
var GaugeBarForHP = defineObject(GaugeBar,
{
	_isReverse: false,
	
	initialize: function() {
		this._balancer = createObject(SimpleBalancerForHP);

		// HPバー画像未取得（null）の場合は取得
		if( hpBarPic == null ) {
			hpBarPic = root.getMaterialManager().createImage(HPBar_SETTING.Folder, HPBar_SETTING.hpBarImg);
		}
	},
	
	setGaugeInfo: function(value, maxValue, colorIndex) {
		GaugeBar.setGaugeInfo.call(this, value, maxValue, colorIndex);

		this._balancer.setBalancerSpeed(HPDmgDispKoma);
		this._balancer.setBalancerFirstValue(value);
	},
	
	drawGaugeBar: function(xBase, yBase, pic) {		// 引数のpicは使用しないが、呼び出し側の互換性の為残している
		var curValue = this._balancer.getCurrentValue();
		var maxValue = this._balancer.getMaxValue();
		var damValue = this._balancer.getCurrentDamageValue();
		var healValue = this._balancer.getCurrentHealValue();
		
		this.drawGauge(xBase+HPBarHoseiX, yBase+HPBarHoseiY, curValue, maxValue, damValue, healValue, this.getGaugeWidth(), hpBarPic);	// picの代わりにhpBarPicを渡している
	},
	
	getGaugeWidth: function() {
		return HPBarPicWidth;
	},
	
	setReverse: function(reverse) {
		this._isReverse = reverse;
	},
	
	drawGauge: function(x, y, curValue, maxValue, damValue, healValue, totalWidth, pic) {
		var curWidth;
		var damWidth;
		var healWidth;
		var dam_x;
		var cur_x;
		var heal_x;
		var width  = totalWidth - (HPBarPicWakuL+HPBarPicWakuR);		// HPBarPicWidthから左右枠分を引いたドット数がバーの幅になる
		var height = HPBarPicHetght;
		
		if (pic === null) {
			return;
		}
		
		curWidth = Math.floor( ((curValue / maxValue) * width) );		// 現在HPの%算出（端数切捨）
		damWidth = Math.floor( ((damValue / maxValue) * width) );		// ダメージによる赤色部分（端数切捨）
		healWidth = Math.floor( ((healValue / maxValue) * width) );		// 回復部分（端数切捨）
		
		// 地の部分は全部一括描画、ダメージ部分は戦闘突入時のHP％分、現在HP部分は現在HP分を描いてるだけです
		// （地の部分 → ダメージ部分 → 現在HP部分の順で描く事で重なる部分が上書きされ、ちゃんと見えています）
		// また、ダメージを受けた時のHP減少処理はSimpleBalancerForHPの中で自動的に行われています

		// 枠とか地の部分
		pic.setReverse(this._isReverse);
		pic.drawParts(x              , y,             0, HPBarBGID * height, totalWidth, height);

		if( isHPDmgDisplay == true ) {
			if( !this._isReverse ) {
				dam_x = x+HPBarPicWakuL;
			}
			else{
				// 反転描画の場合、描画位置をずらす
				dam_x =  x+totalWidth-HPBarPicWakuL-damWidth;
				dam_x += (damWidth&1);			// 奇数幅の場合、反転した画像の座標がずれるのでX座標を補正
			}
			// ダメージ部分
			pic.setReverse(this._isReverse);
			pic.drawParts(dam_x, y, HPBarPicWakuL, HPBarDMID * height, damWidth, height);
		}

		if( isHPHealDisplay == true && healValue > 0 ) {
			if( !this._isReverse ) {
				heal_x = x+HPBarPicWakuL;
			}
			else{
				// 反転描画の場合、描画位置をずらす
				heal_x =  x+totalWidth-HPBarPicWakuL-healWidth;
				heal_x += (healWidth&1);			// 奇数幅の場合、反転した画像の座標がずれるのでX座標を補正
			}
			// 回復部分
			pic.setReverse(this._isReverse);
			pic.drawParts(heal_x, y, HPBarPicWakuL, HPBarHEALID * height, healWidth, height);
		}

		if( !this._isReverse ) {
			cur_x = x+HPBarPicWakuL;
		}
		else{
			// 反転描画の場合、描画位置をずらす
			cur_x =  x+totalWidth-HPBarPicWakuL-curWidth;
			cur_x += (curWidth&1);			// 奇数幅の場合、反転した画像の座標がずれるのでX座標を補正
		}
		// 現在HP部分
		pic.setReverse(this._isReverse);
		pic.drawParts(cur_x, y, HPBarPicWakuL, HPBarHPID * height, curWidth, height);
	}
}
);




//-----------------------------
// SimpleBalancerForHPクラス
//-----------------------------
var SimpleBalancerForHP = defineObject(SimpleBalancer,
{
	_firstValue: 0,
	_healValue: 0,
	
	moveBalancer: function() {
		var isLast;
		
		if (this._counter === null) {
			return MoveResult.END;
		}
		
		if (!this._isMoving) {
			return MoveResult.END;
		}
	
		if (this._counter.moveCycleCounter() !== MoveResult.CONTINUE) {
			if (this._isUp) {
				isLast = this._increaseValue();
			}
			else {
				isLast = this._decreaseValue();
			}
			
			// 限界値に到達した。または必要分だけ上昇させた
			if (isLast) {
				this._isMoving = false;
				// バーゲージの変動が終了した時、回復部分が初期のHPを超えていれば、ダメージ部分を回復部分まで伸ばす
				if( this._healValue > this._firstValue ) {
					this._firstValue = this._healValue;
				}
				// 回復部分を0クリア
				this._healValue = 0;
			}
		}
		
		return MoveResult.CONTINUE;
	},
	
	startBalancerMove: function(value) {
		var floor_value = Math.floor(value);	// 1.5のように小数点以下の値を持っていた場合丸める

		// 小数点以下を丸めた場合
		if( floor_value != value ) {
			// -1.5をMath.floorで丸めると-2になるので+1する
			// （Math.floorは、元の値より小さな整数にする為-1.5が-2になる。0.5を消すわけではない）
			if( floor_value < 0 ) {
				floor_value++;
			}

			// コンソールに警告を出す
			root.log('警告 (リアル戦闘HPバー変更.js)');
			root.log('  ﾀﾞﾒｰｼﾞ小数点有。補正します '+value+'→'+floor_value);
			root.log('  ﾀﾞﾒｰｼﾞ値がおかしい可能性があります');
			root.log('  DamageCalculator.calculateDamageの式を');
			root.log('  変更しているプラグインを確認下さい');
		}
		SimpleBalancer.startBalancerMove.call(this, floor_value);

		// HPが回復する場合は回復値を設定
		if( floor_value > 0 && this._isMoving == true ) {
			this._healValue = this._limitValue;
		}
	},
	
	// ダメージ部分（赤）の値を取得
	getCurrentDamageValue: function() {
		return this._firstValue;
	},
	
	// 回復部分（緑）の値を取得
	getCurrentHealValue: function() {
		return this._healValue;
	},
	
	// 戦闘開始時の、ユニットの現在HPを入れる（ダメージを受けた時の赤バー描画用）
	setBalancerFirstValue: function(firstValue) {
		this._firstValue = firstValue;
	}
}
);




//-----------------------------
// UIBattleLayoutクラス
//-----------------------------
var alias1 = UIBattleLayout.setBattlerAndParent;
UIBattleLayout.setBattlerAndParent= function (battlerRight, battlerLeft, realBattle) {
		alias1.call(this, battlerRight, battlerLeft, realBattle);
		
		var unit, targetUnit;
		
		// バーゲージをGaugeBarForHPクラスに変更
		this._gaugeRight = createObject(GaugeBarForHP);
		this._gaugeLeft = createObject(GaugeBarForHP);
		
		// GaugeBarForHPクラスに必要なデータをセット
		if (battlerRight.isSrc()) {
			unit = battlerRight.getUnit();
			targetUnit = battlerLeft.getUnit();
			
			this._gaugeRight.setGaugeInfo(unit.getHp(), ParamBonus.getMhp(unit), 1);
			this._gaugeLeft.setGaugeInfo(targetUnit.getHp(), ParamBonus.getMhp(targetUnit), 1);
		}
		else {
			unit = battlerLeft.getUnit();
			targetUnit = battlerRight.getUnit();
			
			this._gaugeRight.setGaugeInfo(targetUnit.getHp(), ParamBonus.getMhp(targetUnit), 1);
			this._gaugeLeft.setGaugeInfo(unit.getHp(), ParamBonus.getMhp(unit), 1);
		}
		// 左側のHPバーを反転する場合はsetReverse()にtrueを設定
		if( isLeftBarRev == true ) {
			this._gaugeLeft.setReverse(true);
		}
}


})();