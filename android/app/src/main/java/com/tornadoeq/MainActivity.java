package com.tornadoeq;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    /**
     * Возвращает имя основного компонента (react-native).
     */
    @Override
    protected String getMainComponentName() {
        return "TornadoEQ";
    }
}
