package com.tornadoeq;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.os.BatteryManager;
import android.os.Bundle;
import android.provider.Settings;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    String packageName;
    ComponentName mAdminComponentName;
    DevicePolicyManager mDevicePolicyManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        packageName = this.getPackageName();
        mDevicePolicyManager = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
        mAdminComponentName = new ComponentName(this, TornadoDeviceAdminReceiver.class);


        setKeepScreenOn();
    }

    /**
     * Возвращает имя основного компонента (react-native).
     */
    @Override
    protected String getMainComponentName() {
        return "TornadoEQ";
    }

    protected void setKeepScreenOn() {
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        if (mDevicePolicyManager.isLockTaskPermitted(packageName)) {
            mDevicePolicyManager.setGlobalSetting(mAdminComponentName,
                    Settings.Global.STAY_ON_WHILE_PLUGGED_IN,
                    Integer.toString(BatteryManager.BATTERY_PLUGGED_AC
                            | BatteryManager.BATTERY_PLUGGED_USB
                            | BatteryManager.BATTERY_PLUGGED_WIRELESS));
        }
    }
}
