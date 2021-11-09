package com.tornadoeq.utils;

import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;
import android.telephony.TelephonyManager;

import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.UnsupportedEncodingException;
import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class AuthStoreModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    public AuthStoreModule(ReactApplicationContext reactContext) throws Exception {
        super(reactContext);

        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "AuthStore";
    }

    /**
     * Возвращает токен
     */
    @ReactMethod
    public void getToken(String serial, String salt, Promise promise) {
        byte[] privateKey;
        try {
            String keyString = salt + serial;
            privateKey = keyString.getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
            promise.reject(e);
            return;
        }

        String imei = this.getDeviceID();
        String keyHash = this.MD5(serial);
        String token = Jwts.builder()
                .setHeaderParam("type", "JWT")
                .claim("type", 2)
                .claim("imei", imei)
                .claim("hash", keyHash)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 300000)) // 5 minutes
                .signWith(SignatureAlgorithm.HS256, privateKey)
                .compact();
        promise.resolve(token);
    }

    public String MD5(String md5) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] array = md.digest(md5.getBytes("UTF-8"));
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < array.length; ++i) {
                sb.append(Integer.toHexString((array[i] & 0xFF) | 0x100).substring(1, 3));
            }
            return sb.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
        } catch (UnsupportedEncodingException ex) {
        }
        return null;
    }

    /**
     * Returns the unique identifier for the device
     *
     * @return unique identifier for the device
     */
    public String getDeviceID() {
        String deviceId = null;

        if (ActivityCompat.checkSelfPermission(this.reactContext, android.Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
            TelephonyManager telephonyMgr = (TelephonyManager) this.reactContext.getSystemService(Context.TELEPHONY_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                deviceId = telephonyMgr.getImei();
            } else {
                deviceId = telephonyMgr.getDeviceId();
            }
        }

        if (deviceId == null) {
            deviceId = Settings.Secure.getString(this.reactContext.getContentResolver(), Settings.Secure.ANDROID_ID);
        }
        return deviceId;
    }
}