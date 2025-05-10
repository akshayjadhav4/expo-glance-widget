package com.anonymous.glancewidgetdemo.widgets

import android.content.Context
import androidx.compose.ui.unit.dp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.ImageProvider
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.components.CircleIconButton
import androidx.glance.appwidget.components.Scaffold
import androidx.glance.appwidget.components.SquareIconButton
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import com.anonymous.glancewidgetdemo.R

class ToolbarWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                Scaffold(
                    backgroundColor = GlanceTheme.colors.widgetBackground,
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = GlanceModifier.fillMaxSize()
                    ) {
                        val icons = listOf(
                            R.drawable.add,
                            R.drawable.mic,
                            R.drawable.share,
                            R.drawable.camera
                        )
                        val activeIndex = 0

                        icons.forEachIndexed { index, iconRes ->
                            if (index == activeIndex) {
                                CircleIconButton(
                                    imageProvider = ImageProvider(iconRes),
                                    contentDescription = "Icon $index",
                                    backgroundColor = GlanceTheme.colors.primary,
                                    contentColor = GlanceTheme.colors.onPrimary,
                                    onClick = { },
                                    modifier = GlanceModifier.size(56.dp)
                                )
                            } else {
                                SquareIconButton(
                                    imageProvider = ImageProvider(iconRes),
                                    contentDescription = "Icon $index",
                                    backgroundColor = GlanceTheme.colors.surfaceVariant,
                                    contentColor = GlanceTheme.colors.onSurface,
                                    onClick = { },
                                    modifier = GlanceModifier.size(56.dp)
                                )
                            }

                            if (index != icons.lastIndex) {
                                Spacer(modifier = GlanceModifier.height(12.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}
