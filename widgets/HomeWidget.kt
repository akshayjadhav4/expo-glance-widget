package com.anonymous.glancewidgetdemo.widgets

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.ImageProvider
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.components.Scaffold
import androidx.glance.appwidget.components.TitleBar
import androidx.glance.appwidget.provideContent
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import com.anonymous.glancewidgetdemo.MainActivity
import com.anonymous.glancewidgetdemo.R

class HomeWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {

        // In this method, load data needed to render the AppWidget.
        // Use withContext to switch to another thread for long running
        // operations.

        provideContent {
            GlanceTheme {
                Scaffold(
                    backgroundColor = GlanceTheme.colors.widgetBackground,
                    titleBar = {
                        TitleBar(
                            startIcon = ImageProvider(R.drawable.react_logo),
                            title = "Glance Widget",
                        )
                    },
                    modifier = GlanceModifier.clickable(actionStartActivity<MainActivity>())
                ) {
                    Text("Hello React Native", style = TextStyle(color = GlanceTheme.colors.onSurface))
                }
            }
        }
    }
}
