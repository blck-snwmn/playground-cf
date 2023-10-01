#!/bin/bash

# .wrangler/migrations ディレクトリを確認し、存在しない場合は作成する
mkdir -p .wrangler/migrations

# prisma/migrations ディレクトリ内の各サブディレクトリをループ処理する
for dir in prisma/migrations/*; do
    # ディレクトリであることを確認する
    if [[ -d $dir ]]; then
        # マイグレーション名を取得する
        migration_name=$(basename $dir)
        # migration.sqlファイルが存在するか確認する
        if [[ -f $dir/migration.sql ]]; then
            # migration.sqlファイルを .wrangler/migrations ディレクトリにコピーする
            cp $dir/migration.sql .wrangler/migrations/$migration_name.sql
        fi
    fi
done